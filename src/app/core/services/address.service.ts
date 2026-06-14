import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Address } from '../models/address.model';
import { AddressesApiService } from './addresses-api.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly addressesApi = inject(AddressesApiService);
  private readonly snackbar = inject(SnackbarService);
  private readonly authService = inject(AuthService);

  private readonly _addresses = signal<Address[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly state
  public readonly addresses = this._addresses.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  // Derived computed signals
  public readonly defaultAddress = computed(() => this.addresses().find(a => a.isDefault));
  public readonly isEmpty = computed(() => this.addresses().length === 0);

  constructor() {
    // Automatically load/clear addresses when auth state changes
    effect(() => {
      const isAuthenticated = this.authService.isAuthenticated();
      if (isAuthenticated) {
        this.loadAddresses();
      } else {
        this._addresses.set([]);
      }
    });
  }

  public loadAddresses(): void {
    this._loading.set(true);
    this._error.set(null);

    this.addressesApi.getAddresses().subscribe({
      next: (addresses) => {
        this._addresses.set(addresses);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Could not load your addresses.');
        this._loading.set(false);
      }
    });
  }

  public addAddress(address: Address): Observable<Address> {
    this._loading.set(true);
    return this.addressesApi.createAddress(address).pipe(
      tap((newAddress) => {
        // If this new address is set as default, we need to clear previous default addresses in our local state
        let updated = [...this._addresses()];
        if (newAddress.isDefault) {
          updated = updated.map(a => ({ ...a, isDefault: false }));
        }
        this._addresses.set([...updated, newAddress]);
        this._loading.set(false);
        this.snackbar.success('Address added successfully.');
      }),
      catchError((err) => {
        this._loading.set(false);
        this.snackbar.error(err?.error?.message || 'Failed to add address.');
        return throwError(() => err);
      })
    );
  }

  public updateAddress(id: number, address: Address): void {
    this._loading.set(true);
    this.addressesApi.updateAddress(id, address).subscribe({
      next: (updatedAddress) => {
        let updated = this._addresses().map(a => a.id === id ? updatedAddress : a);
        if (updatedAddress.isDefault) {
          updated = updated.map(a => a.id !== id ? { ...a, isDefault: false } : a);
        }
        this._addresses.set(updated);
        this._loading.set(false);
        this.snackbar.success('Address updated successfully.');
      },
      error: (err) => {
        this._loading.set(false);
        this.snackbar.error(err?.error?.message || 'Failed to update address.');
      }
    });
  }

  public deleteAddress(id: number): void {
    this._loading.set(true);
    this.addressesApi.deleteAddress(id).subscribe({
      next: () => {
        const updated = this._addresses().filter(a => a.id !== id);
        this._addresses.set(updated);
        this._loading.set(false);
        this.snackbar.success('Address deleted successfully.');
      },
      error: (err) => {
        this._loading.set(false);
        this.snackbar.error(err?.error?.message || 'Failed to delete address.');
      }
    });
  }

  public setDefault(id: number): void {
    this._loading.set(true);
    this.addressesApi.setDefaultAddress(id).subscribe({
      next: (updatedAddress) => {
        const updated = this._addresses().map(a => 
          a.id === id ? updatedAddress : { ...a, isDefault: false }
        );
        this._addresses.set(updated);
        this._loading.set(false);
        this.snackbar.success('Default address updated.');
      },
      error: (err) => {
        this._loading.set(false);
        this.snackbar.error(err?.error?.message || 'Failed to set default address.');
      }
    });
  }
}
