import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly accessTokenKey = environment.tokenStorageKey;
  private readonly refreshTokenKey = `${environment.tokenStorageKey}-refresh`;

  getAccessToken(): string | null {
    return this.getLocalStorage()?.getItem(this.accessTokenKey)
      ?? this.getSessionStorage()?.getItem(this.accessTokenKey)
      ?? null;
  }

  getRefreshToken(): string | null {
    return this.getLocalStorage()?.getItem(this.refreshTokenKey)
      ?? this.getSessionStorage()?.getItem(this.refreshTokenKey)
      ?? null;
  }

  // Backwards compatibility or primary token check
  getToken(): string | null {
    return this.getAccessToken();
  }

  setTokens(accessToken: string, refreshToken: string, rememberSession = true): void {
    this.clearToken();

    if (rememberSession) {
      this.getLocalStorage()?.setItem(this.accessTokenKey, accessToken);
      this.getLocalStorage()?.setItem(this.refreshTokenKey, refreshToken);
      return;
    }

    this.getSessionStorage()?.setItem(this.accessTokenKey, accessToken);
    this.getSessionStorage()?.setItem(this.refreshTokenKey, refreshToken);
  }

  hasToken(): boolean {
    return !!this.getAccessToken();
  }

  clearToken(): void {
    this.getLocalStorage()?.removeItem(this.accessTokenKey);
    this.getLocalStorage()?.removeItem(this.refreshTokenKey);
    this.getSessionStorage()?.removeItem(this.accessTokenKey);
    this.getSessionStorage()?.removeItem(this.refreshTokenKey);
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
