import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../../core/services/cart.service';
import { ButtonStyleDirective } from '../../../../shared/directives/button-style.directive';
import { APP_CONSTANTS } from '../../../../core/config/app.constants';

@Component({
  selector: 'app-cart-summary',
  imports: [
    CurrencyPipe,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    RouterLink,
    ButtonStyleDirective
  ],
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss'
})
export class CartSummaryComponent {
  private readonly cartService = inject(CartService);

  public readonly subtotal = this.cartService.total;
  public readonly isEmpty = this.cartService.isEmpty;
  public readonly loading = this.cartService.loading;
  protected readonly currencyCode = APP_CONSTANTS.currencyCode;

  public readonly shippingCost = computed(() => {
    const total = this.subtotal();
    if (total === 0) return 0;
    return total > 599 ? 0 : 49; // Free shipping over 599
  });

  public readonly platformFee = computed(() => {
    return this.subtotal() > 0 ? 5 : 0;
  });

  public readonly grandTotal = computed(() => {
    return this.subtotal() + this.shippingCost() + this.platformFee();
  });
}
