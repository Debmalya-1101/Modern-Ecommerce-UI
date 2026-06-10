import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AppHttpError, createInitialRequestState } from '../../core/models/api.model';
import { BackendConnectionStatus } from '../../core/models/backend-status.model';
import { BackendStatusService } from '../../core/services/backend-status.service';
import { ProductsApiService } from '../../core/services/products-api.service';
import { CartService } from '../../core/services/cart.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { ConfirmationDialogService } from '../../shared/services/confirmation-dialog.service';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { ProductGridComponent } from '../../shared/ui/product/product-grid/product-grid.component';
import { ProductSkeletonLoadingComponent } from '../../shared/ui/product/product-skeleton-loading/product-skeleton-loading.component';
import { ProductCardViewModel } from '../../shared/ui/product/product-ui.model';

@Component({
  selector: 'app-home-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatIconModule,
    RouterLink,
    ButtonStyleDirective,
    EmptyStateComponent,
    ErrorStateComponent,
    ProductGridComponent,
    ProductSkeletonLoadingComponent
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly backendStatusService = inject(BackendStatusService);
  private readonly productsApiService = inject(ProductsApiService);
  private readonly cartService = inject(CartService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly confirmationDialogService = inject(ConfirmationDialogService);
  private readonly router = inject(Router);

  // Home Page Signals
  protected readonly backendStatus = signal(createInitialRequestState<BackendConnectionStatus>());
  protected readonly categoriesState = signal(createInitialRequestState<string[]>([]));
  protected readonly featuredProductsState = signal(createInitialRequestState<ProductCardViewModel[]>([]));

  // Carousel Signals and Data
  protected readonly carouselIndex = signal(0);
  private autoplayIntervalId: any;

  protected readonly carouselSlides = signal([
    {
      image: '/hero_tech_banner.png',
      title: 'Immersive Soundscapes',
      subtitle: 'Discover noise-canceling headphones, wireless earbuds, and premium audio gear for pure sound.',
      ctaText: 'Shop Headphones',
      category: 'Headphones'
    },
    {
      image: '/hero_fashion_banner.png',
      title: 'The Essence of Minimalism',
      subtitle: 'Curated premium coordinates and active style items. Track your day with smart wearable devices.',
      ctaText: 'Shop Smartwatches',
      category: 'Smartwatches'
    },
    {
      image: '/hero_decor_banner.png',
      title: 'Modern Living Comforts',
      subtitle: 'Upgrade your living space with smart televisions, home theater systems, and cozy minimalist styling.',
      ctaText: 'Shop Televisions',
      category: 'Televisions'
    }
  ]);

  ngOnInit(): void {
    this.checkBackendConnection();
    this.loadCategories();
    this.loadFeaturedProducts();
    this.startAutoplay();

    // Register autoplay cleanup
    this.destroyRef.onDestroy(() => this.stopAutoplay());
  }

  // Carousel controls
  protected nextSlide(): void {
    this.carouselIndex.update((current) => (current + 1) % this.carouselSlides().length);
  }

  protected prevSlide(): void {
    this.carouselIndex.update(
      (current) => (current - 1 + this.carouselSlides().length) % this.carouselSlides().length
    );
  }

  protected setSlide(index: number): void {
    this.carouselIndex.set(index);
  }

  protected onCarouselMouseEnter(): void {
    this.stopAutoplay();
  }

  protected onCarouselMouseLeave(): void {
    this.startAutoplay();
  }

  private startAutoplay(): void {
    this.stopAutoplay(); // Ensure no duplicate intervals
    this.autoplayIntervalId = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  private stopAutoplay(): void {
    if (this.autoplayIntervalId) {
      clearInterval(this.autoplayIntervalId);
      this.autoplayIntervalId = null;
    }
  }

  // Category Helpers
  protected getCategoryImg(category: string): string {
    const imgMap: Record<string, string> = {
      headphones: '/cat_headphones.png',
      laptops: '/cat_laptops.png',
      smartphones: '/cat_smartphones.png',
      smartwatches: '/cat_smartwatches.png',
      speakers: '/cat_speakers.png',
      televisions: '/cat_televisions.png'
    };
    return imgMap[category.toLowerCase()] ?? '/favicon.ico';
  }

  // Data Loading
  protected retryAllLoading(): void {
    this.checkBackendConnection();
    this.loadCategories();
    this.loadFeaturedProducts();
  }

  private checkBackendConnection(): void {
    this.backendStatus.set({
      data: null,
      error: null,
      loading: true
    });

    this.backendStatusService
      .checkConnection()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.backendStatus.update((state) => ({
            ...state,
            loading: false
          }));
        })
      )
      .subscribe({
        next: (status) => {
          this.backendStatus.set({
            data: status,
            error: null,
            loading: false
          });
        },
        error: (error: AppHttpError) => {
          this.backendStatus.set({
            data: null,
            error: error.message,
            loading: false
          });
        }
      });
  }

  private loadCategories(): void {
    this.categoriesState.set({
      data: [],
      error: null,
      loading: true
    });

    this.productsApiService
      .getCatalogCategories()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.categoriesState.update((state) => ({ ...state, loading: false }));
        })
      )
      .subscribe({
        next: (categories) => {
          this.categoriesState.set({
            data: categories,
            error: null,
            loading: false
          });
        },
        error: (error: AppHttpError) => {
          this.categoriesState.set({
            data: [],
            error: error.message || 'Could not load categories.',
            loading: false
          });
        }
      });
  }

  private loadFeaturedProducts(): void {
    this.featuredProductsState.set({
      data: [],
      error: null,
      loading: true
    });

    // Query for 4 top-rated items to display as "Featured Products"
    this.productsApiService
      .getProducts({ size: 4, sortBy: 'rating', order: 'desc' })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.featuredProductsState.update((state) => ({ ...state, loading: false }));
        })
      )
      .subscribe({
        next: (paginatedResponse) => {
          const mappedProducts = paginatedResponse.products.map((product) => {
            return {
              id: product.id,
              name: product.name,
              brand: product.brand,
              category: product.categoryName,
              price: product.price,
              rating: product.rating,
              imageUrl: product.imageUrl,
              reviewCount: product.ratingCount ?? 0,
              imageLabel: product.name,
              shortDescription: product.shortDescription,
              badge: undefined,
              originalPrice: undefined,
            };
          });

          this.featuredProductsState.set({
            data: mappedProducts,
            error: null,
            loading: false
          });
        },
        error: (error: AppHttpError) => {
          this.featuredProductsState.set({
            data: [],
            error: error.message || 'Could not load featured products.',
            loading: false
          });
        }
      });
  }

  // Product Grid event handlers
  protected handleQuickView(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  protected handleAddToCart(productId: number): void {
    this.cartService.addToCart(productId, 1);
  }
}
