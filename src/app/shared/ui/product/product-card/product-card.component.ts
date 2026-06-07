import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { ButtonStyleDirective } from '../../../directives/button-style.directive';
import { ProductBadgeComponent } from '../product-badge/product-badge.component';
import { ProductCategoryChipComponent } from '../product-category-chip/product-category-chip.component';
import { ProductImagePlaceholderComponent } from '../product-image-placeholder/product-image-placeholder.component';
import { ProductPriceDisplayComponent } from '../product-price-display/product-price-display.component';
import { ProductRatingDisplayComponent } from '../product-rating-display/product-rating-display.component';
import { ProductCardViewModel } from '../product-ui.model';

@Component({
  selector: 'app-product-card',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterLink,
    ButtonStyleDirective,
    ProductBadgeComponent,
    ProductCategoryChipComponent,
    ProductImagePlaceholderComponent,
    ProductPriceDisplayComponent,
    ProductRatingDisplayComponent
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  private readonly wishlistService = inject(WishlistService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Input({ required: true }) product!: ProductCardViewModel;
  @Output() quickView = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<number>();

  protected readonly isInWishlist = computed(() => this.wishlistService.hasItem(this.product.id));

  protected openQuickView(): void {
    this.quickView.emit(this.product.id);
  }

  protected onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product.id);
  }

  protected onToggleWishlist(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { redirectTo: this.router.url }
      });
      return;
    }

    this.wishlistService.toggleWishlist(this.product.id);
  }
}
