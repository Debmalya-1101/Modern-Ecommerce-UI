import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CartService } from '../../core/services/cart.service';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { CartRecommendationsCarouselComponent } from './components/cart-recommendations-carousel/cart-recommendations-carousel.component';
import { SaveForLaterListComponent } from './components/save-for-later-list/save-for-later-list.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';

@Component({
  selector: 'app-cart-page',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    CartItemComponent,
    CartSummaryComponent,
    CartRecommendationsCarouselComponent,
    SaveForLaterListComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingSpinnerComponent,
    ButtonStyleDirective
  ],
  templateUrl: './cart.page.html',
  styleUrl: './cart.page.scss'
})
export class CartPage {
  private readonly cartService = inject(CartService);

  public readonly cartItems = this.cartService.items;
  public readonly itemCount = this.cartService.itemCount;
  public readonly isEmpty = this.cartService.isEmpty;
  public readonly loading = this.cartService.loading;
  public readonly error = this.cartService.error;
  public readonly hasSavedItems = computed(() => this.cartService.savedItems().length > 0);

  protected handleIncreaseQuantity(itemId: number): void {
    const item = this.cartItems().find((i) => i.itemId === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  protected handleDecreaseQuantity(itemId: number): void {
    const item = this.cartItems().find((i) => i.itemId === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity - 1);
    }
  }

  protected handleRemoveItem(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }

  protected handleSaveForLater(itemId: number): void {
    this.cartService.saveForLater(itemId);
  }

  protected reloadCart(): void {
    this.cartService.loadCart();
  }
}
