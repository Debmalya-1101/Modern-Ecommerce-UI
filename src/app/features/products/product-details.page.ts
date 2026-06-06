import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AppHttpError, createInitialRequestState } from '../../core/models/api.model';
import { ProductDetail } from '../../core/models/product.model';
import { ProductsApiService } from '../../core/services/products-api.service';
import { CartService } from '../../core/services/cart.service';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';
import { ProductBadgeComponent } from '../../shared/ui/product/product-badge/product-badge.component';
import { ProductCategoryChipComponent } from '../../shared/ui/product/product-category-chip/product-category-chip.component';
import { ProductImagePlaceholderComponent } from '../../shared/ui/product/product-image-placeholder/product-image-placeholder.component';
import { ProductPriceDisplayComponent } from '../../shared/ui/product/product-price-display/product-price-display.component';
import { ProductRatingDisplayComponent } from '../../shared/ui/product/product-rating-display/product-rating-display.component';
import { ProductStockIndicatorComponent } from '../../shared/ui/product/product-stock-indicator/product-stock-indicator.component';

/** A gallery image entry shown as a thumbnail button on the details page. */
interface GalleryItem {
  url: string;   // The image URL passed to <img src>
  label: string; // Clean display label e.g. "Photo 1", "Photo 2"
}


@Component({
  selector: 'app-product-details-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    RouterLink,
    ButtonStyleDirective,
    ErrorStateComponent,
    LoadingSpinnerComponent,
    ProductBadgeComponent,
    ProductCategoryChipComponent,
    ProductImagePlaceholderComponent,
    ProductPriceDisplayComponent,
    ProductRatingDisplayComponent,
    ProductStockIndicatorComponent
  ],
  templateUrl: './product-details.page.html',
  styleUrl: './product-details.page.scss'
})
export class ProductDetailsPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly productsApiService = inject(ProductsApiService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly cartService = inject(CartService);

  private readonly productState = signal(createInitialRequestState<ProductDetail>());
  protected readonly productId = signal<number | null>(null);
  protected readonly product = this.productState.asReadonly();

  // The URL of the currently-selected gallery image shown in the main viewer
  protected readonly selectedImageUrl = signal('');

  // The quantity the user wishes to add to the cart
  protected readonly selectedQuantity = signal(1);

  /**
   * Gallery items derived from the product's imageGallery array.
   * Each item has the raw URL (for <img src>) and a clean display label.
   * Falls back to a single item using the main imageUrl when no gallery exists.
   */
  protected readonly galleryItems = computed((): GalleryItem[] => {
    const productDetail = this.product().data;

    if (!productDetail) {
      return [];
    }

    if (productDetail.imageGallery.length > 0) {
      return productDetail.imageGallery.map((url, index) => ({
        url,
        label: `Photo ${index + 1}`,
      }));
    }

    // Fallback: single item using the main product image
    return [{ url: productDetail.imageUrl, label: productDetail.name }];
  });

  ngOnInit(): void {
    // React to URL route param changes (handles browser refresh and direct URL visits)
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const routeId = Number(params.get('id'));
        this.loadProduct(routeId);
      });
  }

  protected reloadProduct(): void {
    const currentProductId = this.productId();

    if (currentProductId === null) {
      return;
    }

    this.loadProduct(currentProductId);
  }

  protected selectImage(url: string): void {
    this.selectedImageUrl.set(url);
  }

  protected addToCart(productDetail: ProductDetail): void {
    this.cartService.addToCart(productDetail.id, this.selectedQuantity());
    this.selectedQuantity.set(1); // Reset after adding
  }

  protected updateQuantity(delta: number): void {
    this.selectedQuantity.update((q) => Math.max(1, q + delta));
  }

  protected buyNow(productName: string): void {
    this.snackbarService.info(`Buy now flow for ${productName} is coming soon.`);
  }

  private loadProduct(routeId: number): void {
    if (Number.isNaN(routeId)) {
      this.productId.set(null);
      this.selectedImageUrl.set('');
      this.productState.set({
        data: null,
        error: 'The product ID in the URL is not valid.',
        loading: false,
      });
      return;
    }

    this.productId.set(routeId);
    this.productState.set({
      data: null,
      error: null,
      loading: true,
    });

    this.productsApiService
      .getProductDetail(routeId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.productState.update((state) => ({ ...state, loading: false }));
        })
      )
      .subscribe({
        next: (productDetail) => {
          // Pre-select the first gallery image in the main viewer
          const firstImage = productDetail.imageGallery[0] ?? productDetail.imageUrl;
          this.selectedImageUrl.set(firstImage);

          this.productState.set({
            data: productDetail,
            error: null,
            loading: false,
          });
        },
        error: (error: AppHttpError) => {
          this.selectedImageUrl.set('');
          this.productState.set({
            data: null,
            error: error.message,
            loading: false,
          });
        },
      });
  }
}
