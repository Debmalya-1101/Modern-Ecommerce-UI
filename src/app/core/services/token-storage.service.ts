import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly storageKey = environment.tokenStorageKey;

  getToken(): string | null {
    return this.getLocalStorage()?.getItem(this.storageKey)
      ?? this.getSessionStorage()?.getItem(this.storageKey)
      ?? null;
  }

  setToken(token: string, rememberSession = true): void {
    this.clearToken();

    if (rememberSession) {
      this.getLocalStorage()?.setItem(this.storageKey, token);
      return;
    }

    this.getSessionStorage()?.setItem(this.storageKey, token);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  clearToken(): void {
    this.getLocalStorage()?.removeItem(this.storageKey);
    this.getSessionStorage()?.removeItem(this.storageKey);
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
