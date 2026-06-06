import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductsApiService } from '../../../../core/services/products-api.service';
import { CartService } from '../../../../core/services/cart.service';
import { ProductCardViewModel } from '../../../../shared/ui/product/product-ui.model';
import { ProductCardComponent } from '../../../../shared/ui/product/product-card/product-card.component';
import { ProductSkeletonLoadingComponent } from '../../../../shared/ui/product/product-skeleton-loading/product-skeleton-loading.component';

@Component({
  selector: 'app-cart-recommendations-carousel',
  imports: [
    ProductCardComponent,
    ProductSkeletonLoadingComponent
  ],
  templateUrl: './cart-recommendations-carousel.component.html',
  styleUrl: './cart-recommendations-carousel.component.scss'
})
export class CartRecommendationsCarouselComponent implements OnInit {
  private readonly productsApi = inject(ProductsApiService);
  private readonly cartService = inject(CartService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly recommendations = signal<ProductCardViewModel[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    // Fetch top 4 rated products as recommendations
    this.productsApi.getProducts({ size: 4, sortBy: 'rating', order: 'desc' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const vms = response.products.map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            category: p.categoryName,
            price: p.price,
            rating: p.rating,
            imageUrl: p.imageUrl,
            reviewCount: 0,
            imageLabel: p.name,
            shortDescription: p.shortDescription,
            badge: p.badge,
            originalPrice: p.originalPrice
          }));
          this.recommendations.set(vms);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  protected handleAddToCart(productId: number): void {
    this.cartService.addToCart(productId, 1);
  }
}
