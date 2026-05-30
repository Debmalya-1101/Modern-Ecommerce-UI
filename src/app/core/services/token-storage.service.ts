import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly storageKey = environment.tokenStorageKey;

  getToken(): string | null {
    return this.getStorage()?.getItem(this.storageKey) ?? null;
  }

  setToken(token: string): void {
    this.getStorage()?.setItem(this.storageKey, token);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  clearToken(): void {
    this.getStorage()?.removeItem(this.storageKey);
  }

  private getStorage(): Storage | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage;
  }
}
