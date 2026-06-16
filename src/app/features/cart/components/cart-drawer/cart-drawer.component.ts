import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { CartService } from '../../../../core/services/cart.service';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { ButtonStyleDirective } from '../../../../shared/directives/button-style.directive';
import { APP_CONSTANTS } from '../../../../core/config/app.constants';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-cart-drawer',
  imports: [
    CurrencyPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CartItemComponent,
    EmptyStateComponent,
    ButtonStyleDirective,
    LoadingSpinnerComponent
  ],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.scss'
})
export class CartDrawerComponent {
  private readonly cartService = inject(CartService);

  public readonly cartItems = this.cartService.items;
  public readonly isEmpty = this.cartService.isEmpty;
  public readonly total = this.cartService.total;
  public readonly isAddingToCart = this.cartService.isAddingToCart;
  protected readonly currencyCode = APP_CONSTANTS.currencyCode;

  protected closeDrawer(): void {
    this.cartService.closeDrawer();
  }

  protected handleIncreaseQuantity(itemId: number): void {
    const item = this.cartItems().find(i => i.itemId === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  protected handleDecreaseQuantity(itemId: number): void {
    const item = this.cartItems().find(i => i.itemId === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity - 1);
    }
  }

  protected handleRemoveItem(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }
}
