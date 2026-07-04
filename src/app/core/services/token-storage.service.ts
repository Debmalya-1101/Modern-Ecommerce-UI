import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

/**
 * Manages the access token in browser storage.
 *
 * The refresh token is intentionally NOT stored here.
 * It is stored in a secure HttpOnly cookie set by the backend,
 * which means JavaScript (and therefore XSS attacks) cannot read it.
 * The browser automatically sends the cookie on every request to the backend.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly accessTokenKey = environment.tokenStorageKey;

  getAccessToken(): string | null {
    return this.getLocalStorage()?.getItem(this.accessTokenKey)
      ?? this.getSessionStorage()?.getItem(this.accessTokenKey)
      ?? null;
  }

  // Backwards compatibility alias
  getToken(): string | null {
    return this.getAccessToken();
  }

  setTokens(accessToken: string, rememberSession = true): void {
    this.clearToken();

    if (rememberSession) {
      this.getLocalStorage()?.setItem(this.accessTokenKey, accessToken);
      return;
    }

    this.getSessionStorage()?.setItem(this.accessTokenKey, accessToken);
  }

  hasToken(): boolean {
    return !!this.getAccessToken();
  }

  clearToken(): void {
    this.getLocalStorage()?.removeItem(this.accessTokenKey);
    this.getSessionStorage()?.removeItem(this.accessTokenKey);
  }

  private getLocalStorage(): Storage | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage;
  }

  private getSessionStorage(): Storage | null {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }

    return sessionStorage;
  }
}
