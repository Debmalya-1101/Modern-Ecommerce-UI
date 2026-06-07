import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CartService } from '../../core/services/cart.service';
import { OrdersApiService } from '../../core/services/orders-api.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { APP_CONSTANTS } from '../../core/config/app.constants';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss']
})
export class CheckoutPage {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly ordersApiService = inject(OrdersApiService);
  private readonly snackbar = inject(SnackbarService);
  private readonly router = inject(Router);

  // Currency config
  protected readonly currencyCode = APP_CONSTANTS.currencyCode;

  // Cart signals
  public readonly cartItems = this.cartService.items;
  public readonly cartTotal = this.cartService.total;
  public readonly cartIsEmpty = this.cartService.isEmpty;

  // Component state
  public isSubmitting = signal<boolean>(false);

  public checkoutForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    address: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.cartIsEmpty()) {
      this.snackbar.error('Your cart is empty.');
      return;
    }

    this.isSubmitting.set(true);

    const request = this.checkoutForm.value;
    
    this.ordersApiService.checkout(request).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.snackbar.success('Order placed successfully!');
        // We clear the cart state to simulate what the backend does
        this.cartService.loadCart(); // Backend clears it, so reload will fetch empty cart
        this.router.navigate(['/payment', response.orderId]);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.snackbar.error(err?.error?.message || 'Failed to place order. Please try again.');
      }
    });
  }
}
