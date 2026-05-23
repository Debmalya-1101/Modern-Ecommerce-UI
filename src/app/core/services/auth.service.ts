import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { ApiService } from './api.service';
import { TokenStorageService } from './token-storage.service';
import { AuthResponse, AuthSession, AuthUserInfo, JwtTokenPayload, LoginRequest, SignupRequest, UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly token = signal<string | null>(this.tokenStorage.getToken());
  private readonly currentUser = signal<AuthUserInfo | null>(this.createUserFromToken(this.token()));

  readonly session = computed<AuthSession>(() => ({
    token: this.token(),
    user: this.currentUser()
  }));
  readonly isAuthenticated = computed(() => !!this.token());
  readonly currentRole = computed(() => this.currentUser()?.role ?? this.readRoleFromToken(this.token()));

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.apiService
      .mockResponse<AuthResponse>(this.createMockAuthResponse(request), {
        delayMs: 300,
        message: `Mock POST ${API_ENDPOINTS.auth.login}`,
        trackLoading: true
      })
      .pipe(
        map((response) => response.data ?? this.createMockAuthResponse(request)),
        tap((response) => this.setSessionToken(response.token)),
        tap(() => this.refreshCurrentUser().subscribe())
      );
  }

  signup(request: SignupRequest): Observable<string> {
    return this.apiService
      .mockResponse<string>(`Mock signup completed for ${request.userName}.`, {
        delayMs: 300,
        message: `Mock POST ${API_ENDPOINTS.auth.signup}`,
        trackLoading: true
      })
      .pipe(map((response) => response.data ?? 'Mock signup completed.'));
  }

  refreshCurrentUser(): Observable<AuthUserInfo | null> {
    if (!this.token()) {
      this.currentUser.set(null);
      return of(null);
    }

    return this.apiService
      .mockResponse<AuthUserInfo>(this.createMockCurrentUser(), {
        delayMs: 200,
        message: `Mock GET ${API_ENDPOINTS.auth.me}`,
        trackLoading: false
      })
      .pipe(
        map((response) => response.data ?? this.createMockCurrentUser()),
        tap((user) => this.currentUser.set(user)),
        catchError(() => {
          this.currentUser.set(this.createUserFromToken(this.token()));
          return of(this.currentUser());
        })
      );
  }

  logout(): void {
    this.tokenStorage.clearToken();
    this.token.set(null);
    this.currentUser.set(null);
  }

  hasToken(): boolean {
    return !!this.token();
  }

  hasRole(role: UserRole): boolean {
    return this.currentRole() === role;
  }

  getToken(): string | null {
    return this.token();
  }

  private setSessionToken(token: string): void {
    this.tokenStorage.setToken(token);
    this.token.set(token);
    this.currentUser.set(this.createUserFromToken(token));
  }

  private createMockAuthResponse(request: LoginRequest): AuthResponse {
    const username = request.usernameOrEmail.includes('@')
      ? request.usernameOrEmail.split('@')[0]
      : request.usernameOrEmail;

    const payload = {
      sub: username,
      role: 'ROLE_USER' as const,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
    };

    return {
      token: this.createMockJwtToken(payload),
      tokenType: 'Bearer'
    };
  }

  private createMockCurrentUser(): AuthUserInfo {
    return this.createUserFromToken(this.token()) ?? {
      username: 'demo-user',
      emailId: 'demo@modern-commerce.dev',
      role: 'ROLE_USER'
    };
  }

  private createMockJwtToken(payload: JwtTokenPayload): string {
    const header = { alg: 'none', typ: 'JWT' };

    return [
      btoa(JSON.stringify(header)),
      btoa(JSON.stringify(payload)),
      'mock-signature'
    ].join('.');
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
