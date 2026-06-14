import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AuthService } from '../../core/services/auth.service';
import { AddressService } from '../../core/services/address.service';
import { Address } from '../../core/models/address.model';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
import { AddressCardComponent } from '../../shared/ui/address-card/address-card.component';
import { AddressFormComponent, AddressDialogData } from '../../shared/ui/address-form/address-form.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    LoadingSpinnerComponent,
    ButtonStyleDirective,
    AddressCardComponent
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly addressService = inject(AddressService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly user = computed(() => this.authService.session().user);
  
  // Expose address signals
  protected readonly addresses = this.addressService.addresses;
  protected readonly addressesLoading = this.addressService.loading;
  protected readonly addressesError = this.addressService.error;

  ngOnInit(): void {
    this.loadProfile();
  }

  protected loadProfile(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.authService.refreshCurrentUser().subscribe({
      next: (user) => {
        this.isLoading.set(false);
        if (!user) {
          this.error.set('Failed to load user profile information.');
        } else {
          // Trigger loading addresses
          this.addressService.loadAddresses();
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.message || 'An error occurred while loading profile.');
      }
    });
  }

  protected openAddAddressDialog(): void {
    const dialogRef = this.dialog.open<AddressFormComponent, AddressDialogData, Address>(
      AddressFormComponent,
      {
        width: '550px',
        maxWidth: '95vw',
        panelClass: 'app-dialog-container'
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addressService.addAddress(result).subscribe();
      }
    });
  }

  protected openEditAddressDialog(address: Address): void {
    const dialogRef = this.dialog.open<AddressFormComponent, AddressDialogData, Address>(
      AddressFormComponent,
      {
        width: '550px',
        maxWidth: '95vw',
        panelClass: 'app-dialog-container',
        data: { address }
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result && address.id) {
        this.addressService.updateAddress(address.id, result);
      }
    });
  }

  protected onDeleteAddress(id: number): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addressService.deleteAddress(id);
    }
  }

  protected onSetDefaultAddress(id: number): void {
    this.addressService.setDefault(id);
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  protected formatRole(role?: string): string {
    if (!role) return 'N/A';
    if (role === 'ROLE_ADMIN') return 'Administrator';
    if (role === 'ROLE_USER') return 'Customer';
    return role;
  }
}
