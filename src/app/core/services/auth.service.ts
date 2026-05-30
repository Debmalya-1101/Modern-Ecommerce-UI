import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, map, of, switchMap, tap, throwError } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { AppHttpError } from '../models/api.model';
import { ApiService } from './api.service';
import { TokenStorageService } from './token-storage.service';
import { AuthResponse, AuthSession, AuthState, AuthUserInfo, JwtTokenPayload, LoginRequest, SignupRequest, UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly token = signal<string | null>(this.tokenStorage.getToken());
  private readonly currentUser = signal<AuthUserInfo | null>(this.createUserFromToken(this.token()));
  private readonly isLoading = signal(false);
  private readonly isReady = signal(false);
  private readonly authError = signal<string | null>(null);

  readonly session = computed<AuthSession>(() => ({
    token: this.token(),
    user: this.currentUser()
  }));
  readonly isAuthenticated = computed(() => !!this.token());
  readonly currentRole = computed(() => this.currentUser()?.role ?? this.readRoleFromToken(this.token()));
  readonly state = computed<AuthState>(() => ({
    isAuthenticated: this.isAuthenticated(),
    isLoading: this.isLoading(),
    isReady: this.isReady(),
    error: this.authError()
  }));

  login(request: LoginRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.authError.set(null);

    return this.apiService
      .post<AuthResponse, LoginRequest>(API_ENDPOINTS.auth.login, request, {
        trackLoading: true
      })
      .pipe(
        tap((response) => this.setSessionToken(response.token)),
        switchMap((response) =>
          this.refreshCurrentUser().pipe(
            map(() => response)
          )
        ),
        tap(() => this.isReady.set(true)),
        catchError((error: AppHttpError) => {
          this.authError.set(error.message);
          return throwError(() => error);
        }),
        finalize(() => this.isLoading.set(false))
      );
  }

  signup(request: SignupRequest): Observable<string> {
    this.isLoading.set(true);
    this.authError.set(null);

    return this.apiService
      .post<string, SignupRequest>(API_ENDPOINTS.auth.signup, request, {
        trackLoading: true
      })
      .pipe(
        catchError((error: AppHttpError) => {
          this.authError.set(error.message);
          return throwError(() => error);
        }),
        finalize(() => this.isLoading.set(false))
      );
  }

  refreshCurrentUser(): Observable<AuthUserInfo | null> {
    if (!this.token()) {
      this.currentUser.set(null);
      return of(null);
    }

    return this.apiService
      .get<AuthUserInfo>(API_ENDPOINTS.auth.me, undefined, {
        trackLoading: false
      })
      .pipe(
        tap((user) => this.currentUser.set(user)),
        catchError((error: AppHttpError) => {
          if (error.status !== 401) {
            this.currentUser.set(this.createUserFromToken(this.token()));
            return of(this.currentUser());
          }

          this.currentUser.set(this.createUserFromToken(this.token()));
          return of(this.currentUser());
        })
      );
  }

  restoreSession(): void {
    this.isLoading.set(true);
    this.authError.set(null);

    const storedToken = this.tokenStorage.getToken();

    if (!storedToken) {
      this.clearSessionState();
      this.isReady.set(true);
      this.isLoading.set(false);
      return;
    }

    if (this.isTokenExpired(storedToken)) {
      this.logout();
      this.authError.set('The saved session expired and was cleared.');
      this.isReady.set(true);
      this.isLoading.set(false);
      return;
    }

    this.token.set(storedToken);
    this.currentUser.set(this.createUserFromToken(storedToken));

    this.refreshCurrentUser()
      .pipe(
        finalize(() => {
          this.isReady.set(true);
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.authError.set(null);
        },
        error: () => {
          this.currentUser.set(this.createUserFromToken(this.token()));
        }
      });
  }

  logout(): void {
    this.tokenStorage.clearToken();
    this.clearSessionState();
    this.authError.set(null);
    this.isReady.set(true);
  }

  hasToken(): boolean {
    return this.isAuthenticated();
  }

  hasRole(role: UserRole): boolean {
    return this.currentRole() === role;
  }

  getAccessToken(): string | null {
    return this.token();
  }

  getToken(): string | null {
    return this.getAccessToken();
  }

  private setSessionToken(token: string): void {
    this.tokenStorage.setToken(token);
    this.token.set(token);
    this.currentUser.set(this.createUserFromToken(token));
    this.authError.set(null);
  }

  private createUserFromToken(token: string | null): AuthUserInfo | null {
    const payload = this.readTokenPayload(token);

    if (!payload?.sub || !payload.role) {
      return null;
    }

    return {
      username: payload.sub,
      emailId: '',
      role: payload.role
    };
  }

  private readRoleFromToken(token: string | null): UserRole | null {
    return this.readTokenPayload(token)?.role ?? null;
  }

  private isTokenExpired(token: string): boolean {
    const expiresAt = this.readTokenPayload(token)?.exp;

    if (!expiresAt) {
      return false;
    }

    return expiresAt * 1000 <= Date.now();
  }

  private clearSessionState(): void {
    this.token.set(null);
    this.currentUser.set(null);
  }

  private readTokenPayload(token: string | null): JwtTokenPayload | null {
    if (!token) {
      return null;
    }

    const tokenParts = token.split('.');

    if (tokenParts.length < 2) {
      return null;
    }

    try {
      const payload = atob(tokenParts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(payload) as JwtTokenPayload;
    } catch {
      return null;
    }
  }
}
