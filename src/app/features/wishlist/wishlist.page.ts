import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCardComponent } from '../../shared/ui/product/product-card/product-card.component';
import { ProductCardViewModel } from '../../shared/ui/product/product-ui.model';
import { WishlistItem } from '../../core/models/wishlist.model';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ProductCardComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './wishlist.page.html',
  styleUrl: './wishlist.page.scss'
})
export class WishlistPage {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  public readonly loading = this.wishlistService.loading;
  public readonly error = this.wishlistService.error;
  public readonly isEmpty = this.wishlistService.isEmpty;
  public readonly itemCount = this.wishlistService.itemCount;
  public readonly items = this.wishlistService.items;

  public readonly wishlistProducts = computed<ProductCardViewModel[]>(() => {
    return this.items().map((item: WishlistItem) => ({
      id: item.productId,
      name: item.productName,
      brand: '', // Fallback or add to WishlistItem later
      category: '', // Fallback or add to WishlistItem later
      imageUrl: item.imageUrl,
      imageLabel: item.productName,
      price: item.price,
      originalPrice: undefined, // Extend if backend provides this
      rating: item.rating,
      reviewCount: 0,
      badge: undefined
    }));
  });

  protected addToCart(productId: number): void {
    const item = this.items().find(i => i.productId === productId);
    if (item) {
      this.cartService.addToCart(item.productId);
    }
  }

  protected retryLoading(): void {
    this.wishlistService.loadWishlist();
  }

  protected continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
