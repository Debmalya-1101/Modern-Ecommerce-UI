import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { CartService } from '../../core/services/cart.service';
import { OrdersApiService } from '../../core/services/orders-api.service';
import { AddressService } from '../../core/services/address.service';
import { AuthService } from '../../core/services/auth.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { APP_CONSTANTS } from '../../core/config/app.constants';
import { AddressCardComponent } from '../../shared/ui/address-card/address-card.component';
import { CheckoutRequest } from '../../core/models/order.model';
import { AddressFormComponent, AddressDialogData } from '../../shared/ui/address-form/address-form.component';
import { Address } from '../../core/models/address.model';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDialogModule,
    AddressCardComponent
  ],
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss']
})
export class CheckoutPage implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly ordersApiService = inject(OrdersApiService);
  private readonly addressService = inject(AddressService);
  private readonly authService = inject(AuthService);
  private readonly snackbar = inject(SnackbarService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  // Currency config
  protected readonly currencyCode = APP_CONSTANTS.currencyCode;

  // Cart signals
  public readonly cartItems = this.cartService.items;
  public readonly cartTotal = this.cartService.total;
  public readonly cartIsEmpty = this.cartService.isEmpty;

  // Address signals
  protected readonly addresses = this.addressService.addresses;
  protected readonly addressesLoading = this.addressService.loading;
  protected readonly selectedAddressId = signal<number | undefined>(undefined);

  // Component state
  public isSubmitting = signal<boolean>(false);

  constructor() {
    // Automatically select the default address when addresses load
    effect(() => {
      const list = this.addresses();
      const isLoading = this.addressesLoading();
      const currentSelection = this.selectedAddressId();
      
      if (!isLoading && list.length > 0 && currentSelection === undefined) {
        const defaultAddr = list.find(a => a.isDefault) || list[0];
        if (defaultAddr && defaultAddr.id) {
          this.selectedAddressId.set(defaultAddr.id);
        }
      }
    });
  }

  ngOnInit(): void {
    this.addressService.loadAddresses();
  }

  protected selectAddress(id: number): void {
    this.selectedAddressId.set(id);
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
        this.addressService.addAddress(result).subscribe({
          next: (newAddress) => {
            if (newAddress && newAddress.id) {
              this.selectedAddressId.set(newAddress.id);
            }
          }
        });
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
        data: {
          mode: 'edit',
          address: { ...address }
        }
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addressService.updateAddress(address.id!, result);
      }
    });
  }

  onSubmit(): void {
    const addressId = this.selectedAddressId();

    if (addressId === undefined) {
      this.snackbar.error('Please select or add a shipping address.');
      return;
    }

    if (this.cartIsEmpty()) {
      this.snackbar.error('Your cart is empty.');
      return;
    }

    this.isSubmitting.set(true);

    const selectedAddr = this.addresses().find(a => a.id === addressId);
    if (!selectedAddr) {
      this.snackbar.error('Selected address is invalid.');
      this.isSubmitting.set(false);
      return;
    }

    const request: CheckoutRequest = {
      addressId: addressId,
      name: selectedAddr.contactName || '',
      phoneNo: selectedAddr.mobileNumber || '',
      email: this.authService.session().user?.emailId || '',
      address: `${selectedAddr.addressLine}, ${selectedAddr.city}, ${selectedAddr.state} ${selectedAddr.postalCode}`
    };
    
    this.ordersApiService.checkout(request).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.snackbar.info('Redirecting to secure payment...');
        this.cartService.loadCart();
        this.router.navigate(['/payment', response.orderId]);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.snackbar.error(err?.error?.message || 'Failed to place order. Please try again.');
      }
    });
  }
}
