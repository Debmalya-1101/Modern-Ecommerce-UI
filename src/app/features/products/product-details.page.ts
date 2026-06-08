import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { WishlistService } from '../../core/services/wishlist.service';

import { AppHttpError, createInitialRequestState } from '../../core/models/api.model';
import { ProductDetail } from '../../core/models/product.model';
import { ProductsApiService } from '../../core/services/products-api.service';
import { CartService } from '../../core/services/cart.service';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';
import { ProductBadgeComponent } from '../../shared/ui/product/product-badge/product-badge.component';
import { ProductImagePlaceholderComponent } from '../../shared/ui/product/product-image-placeholder/product-image-placeholder.component';
import { ProductPriceDisplayComponent } from '../../shared/ui/product/product-price-display/product-price-display.component';
import { ProductRatingDisplayComponent } from '../../shared/ui/product/product-rating-display/product-rating-display.component';
import { ProductStockIndicatorComponent } from '../../shared/ui/product/product-stock-indicator/product-stock-indicator.component';
import { ProductReviewsComponent } from './components/product-reviews/product-reviews.component';

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
    ProductImagePlaceholderComponent,
    ProductPriceDisplayComponent,
    ProductRatingDisplayComponent,
    ProductStockIndicatorComponent,
    ProductReviewsComponent
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
  private readonly authService = inject(AuthService);
  private readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);

  private readonly productState = signal(createInitialRequestState<ProductDetail>());
  protected readonly productId = signal<number | null>(null);
  protected readonly product = this.productState.asReadonly();

  // The URL of the currently-selected gallery image shown in the main viewer
  protected readonly selectedImageUrl = signal('');

  // The quantity the user wishes to add to the cart
  protected readonly selectedQuantity = signal(1);

  // Tracks whether the product specifications table is fully expanded
  protected readonly showAllSpecifications = signal(false);

  /**
   * The list of specifications to display. Show only first 6 rows by default.
   */
  protected readonly visibleSpecifications = computed(() => {
    const productDetail = this.product().data;
    if (!productDetail) {
      return [];
    }
    const specs = productDetail.specifications;
    if (this.showAllSpecifications() || specs.length <= 6) {
      return specs;
    }
    return specs.slice(0, 6);
  });

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

  /**
   * Parses the product description dynamically.
   * If it contains bullet characters (•), it splits them into clean list items.
   * Otherwise, it splits it by double newlines to display as normal paragraphs.
   */
  protected readonly parsedDescription = computed(() => {
    const productDetail = this.product().data;
    if (!productDetail || !productDetail.description) {
      return { isList: false, paragraphs: [] as string[] };
    }

    const desc = productDetail.description;

    if (desc.includes('•') || desc.includes('\u2022')) {
      const parts = desc.split(/•|\u2022/)
        .map(p => p.trim())
        .filter(p => p.length > 0);
      return { isList: true, paragraphs: parts };
    }

    const paragraphs = desc.split(/\n\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    return { isList: false, paragraphs };
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

  protected prevImage(): void {
    const items = this.galleryItems();
    if (items.length <= 1) return;
    const currentUrl = this.selectedImageUrl() || this.product().data?.imageUrl || '';
    const currentIndex = items.findIndex(item => item.url === currentUrl);
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    this.selectedImageUrl.set(items[prevIndex].url);
  }

  protected nextImage(): void {
    const items = this.galleryItems();
    if (items.length <= 1) return;
    const currentUrl = this.selectedImageUrl() || this.product().data?.imageUrl || '';
    const currentIndex = items.findIndex(item => item.url === currentUrl);
    const nextIndex = (currentIndex + 1) % items.length;
    this.selectedImageUrl.set(items[nextIndex].url);
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

  protected isInWishlist(productId: number): boolean {
    return this.wishlistService.hasItem(productId);
  }

  protected toggleWishlist(productId: number): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { redirectTo: this.router.url }
      });
      return;
    }
    this.wishlistService.toggleWishlist(productId);
  }

  protected toggleSpecifications(): void {
    this.showAllSpecifications.update((val) => !val);
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
          this.showAllSpecifications.set(false); // Reset specifications toggle

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
