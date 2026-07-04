import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, map, of, switchMap, tap, throwError } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { AppHttpError } from '../models/api.model';
import { ApiService } from './api.service';
import { TokenStorageService } from './token-storage.service';
import { AuthResponse, AuthSession, AuthState, AuthUserInfo, JwtTokenPayload, LoginRequest, SignupRequest, TokenRefreshResponse, UserRole } from '../models/auth.model';

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

  login(request: LoginRequest, rememberSession = true): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.authError.set(null);

    return this.apiService
      .post<AuthResponse, LoginRequest>(API_ENDPOINTS.auth.login, request, {
        trackLoading: true,
        // Required to allow the browser to receive and store the HttpOnly refresh-token cookie
        withCredentials: true
      })
      .pipe(
        tap((response) => this.setSessionToken(response.accessToken, rememberSession)),
        switchMap((response) =>
          this.refreshCurrentUser().pipe(
            map(() => response)
          )
        ),
        tap(() => this.isReady.set(true)),
        catchError((error: AppHttpError) => {
          if (error.status === 403) {
            const isGenericForbidden = !error.message || error.message.toLowerCase() === 'forbidden';
            const message = isGenericForbidden
              ? 'Your delivery partner account is pending approval, rejected, or suspended. Please contact the administrator.'
              : error.message;
            this.authError.set(message);
          } else {
            this.authError.set(error.message);
          }
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
        trackLoading: true,
        responseType: 'text'
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
          if (error.status === 401) {
            this.clearSessionState();
            return of(null);
          }

          this.currentUser.set(this.createUserFromToken(this.token()));
          return of(this.currentUser());
        })
      );
  }

  /**
   * Calls POST /auth/refresh with credentials (so the browser sends the HttpOnly cookie).
   * The backend reads the cookie, rotates the refresh token, sets a new cookie, and
   * returns a fresh access token in the JSON body.
   *
   * On failure, ONLY clears local state — does NOT call logout() to avoid firing
   * another HTTP request that could create an infinite loop.
   */
  refreshSession(): Observable<TokenRefreshResponse> {
    return this.apiService
      .post<TokenRefreshResponse, Record<string, never>>(API_ENDPOINTS.auth.refresh, {}, {
        trackLoading: false,
        // withCredentials is essential — this is what sends the HttpOnly cookie to the backend
        withCredentials: true
      })
      .pipe(
        tap((response) => {
          this.setSessionToken(response.accessToken, true);
        }),
        catchError((error) => {
          // Clear local state only. Do NOT call logout() here — that would fire
          // another HTTP request and can cause an infinite refresh/logout loop.
          this.clearLocalSession();
          return throwError(() => error);
        })
      );
  }

  /**
   * Called after a successful OAuth2 social login.
   * The access token arrives as a query param; the refresh token is already stored
   * in an HttpOnly cookie set by the backend — no further action needed for it.
   */
  setTokensFromOAuth(accessToken: string): void {
    this.setSessionToken(accessToken, true);
    this.isReady.set(true);
  }

  restoreSession(): void {
    this.isLoading.set(true);
    this.authError.set(null);

    const storedToken = this.tokenStorage.getToken();

    if (!storedToken || this.isTokenExpired(storedToken)) {
      // Either no access token in storage, or the stored one has expired.
      //
      // Attempt a silent refresh using the HttpOnly cookie.
      // This is the correct path for:
      //   • Users returning after the 15-min access token lifetime (cookie still valid)
      //   • Users after a page reload where the token was stored in sessionStorage
      //
      // Safe to try even with no stored token because:
      //   • refreshSession() failure calls clearLocalSession() (no HTTP), NOT logout()
      //   • The error interceptor excludes /auth/refresh from the retry loop
      //   → No infinite loop risk.
      this.refreshSession().pipe(
        finalize(() => {
          this.isReady.set(true);
          this.isLoading.set(false);
        })
      ).subscribe({
        next: () => {
          this.authError.set(null);
        },
        error: () => {
          // Cookie was absent or expired — user must log in.
          // clearLocalSession() was already called by refreshSession() catchError.
        }
      });
      return;
    }

    // Access token is valid — restore immediately and verify with the server
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

  /**
   * Clears the local access token and calls the backend logout endpoint
   * so the backend revokes the refresh tokens and clears the HttpOnly cookie.
   *
   * IMPORTANT: The HTTP call is initiated BEFORE clearing local state so that
   * the JWT interceptor can read the token synchronously from the signal and
   * attach it as the Bearer header. Local state is then cleared immediately
   * after — we don't wait for the HTTP response.
   */
  logout(): void {
    // 1. Initiate the backend call FIRST — the JWT interceptor runs synchronously
    //    here and captures the current token before we clear it.
    this.apiService
      .post<string, Record<string, never>>(API_ENDPOINTS.auth.logout, {}, {
        trackLoading: false,
        withCredentials: true,
        responseType: 'text'
      })
      .subscribe({ error: () => { /* silently ignore — cookie will expire naturally */ } });

    // 2. Now clear local state. The HTTP request is already queued with the
    //    correct Authorization header, so clearing state here is safe.
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

  clearError(): void {
    this.authError.set(null);
  }

  private setSessionToken(accessToken: string, rememberSession = true): void {
    this.tokenStorage.setTokens(accessToken, rememberSession);
    this.token.set(accessToken);
    this.currentUser.set(this.createUserFromToken(accessToken));
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

  private clearLocalSession(): void {
    this.tokenStorage.clearToken();
    this.token.set(null);
    this.currentUser.set(null);
    this.isReady.set(true);
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
