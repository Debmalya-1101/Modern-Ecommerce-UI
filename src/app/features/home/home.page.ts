import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
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
    ProductSkeletonLoadingComponent,
    NgOptimizedImage
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
  protected readonly newArrivalsState = signal(createInitialRequestState<ProductCardViewModel[]>([]));

  // Carousel Signals and Data
  protected readonly carouselIndex = signal(0);
  private autoplayIntervalId: any;
  private touchStartX = 0;
  private touchEndX = 0;
  private readonly SWIPE_THRESHOLD = 50;

  protected readonly carouselSlides = signal([
    {
      image: '/hero_headphones_banner.png',
      title: 'Immersive Soundscapes',
      subtitle: 'Discover noise-canceling headphones, wireless earbuds, and premium audio gear for pure sound.',
      ctaText: 'Shop Headphones',
      category: 'Headphones'
    },
    {
      image: '/hero_smartwatches_banner.png',
      title: 'The Essence of Minimalism',
      subtitle: 'Curated premium coordinates and active style items. Track your day with smart wearable devices.',
      ctaText: 'Shop Smartwatches',
      category: 'Smartwatches'
    },
    {
      image: '/hero_televisions_banner.png',
      title: 'Modern Living Comforts',
      subtitle: 'Upgrade your living space with smart televisions, home theater systems, and cozy minimalist styling.',
      ctaText: 'Shop Televisions',
      category: 'Televisions'
    },
    {
      image: '/hero_laptops_banner.png',
      title: 'Ultimate Productivity',
      subtitle: 'Powerful modern laptops and elegant workstations for professionals and creatives.',
      ctaText: 'Shop Laptops',
      category: 'Laptops'
    },
    {
      image: '/hero_smartphones_banner.png',
      title: 'Seamless Connectivity',
      subtitle: 'Experience the latest in mobile technology with our curated smartphone collection.',
      ctaText: 'Shop Smartphones',
      category: 'Smartphones'
    },
    {
      image: '/hero_speakers_banner.png',
      title: 'Room-Filling Audio',
      subtitle: 'Elevate your space with premium speakers and high-fidelity sound systems.',
      ctaText: 'Shop Speakers',
      category: 'Speakers'
    }
  ]);

  ngOnInit(): void {
    this.checkBackendConnection();
    this.loadCategories();
    this.loadFeaturedProducts();
    this.loadNewArrivals();
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

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
    // Pause autoplay during touch interaction
    this.stopAutoplay();
  }

  protected onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
    // Resume autoplay after touch interaction
    this.startAutoplay();
  }

  private handleSwipe(): void {
    const swipeDistance = this.touchStartX - this.touchEndX;
    
    if (Math.abs(swipeDistance) >= this.SWIPE_THRESHOLD) {
      if (swipeDistance > 0) {
        // Swiped left, go to next slide
        this.nextSlide();
      } else {
        // Swiped right, go to previous slide
        this.prevSlide();
      }
    }
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
      'mobile accessories': '/cat_accessories.png',
      smartphones: '/cat_smartphones.png',
      smartwatches: '/cat_smartwatches.png',
      speakers: '/cat_speakers.png',
      tablets: '/cat_tablets.png',
      televisions: '/cat_televisions.png'
    };
    return imgMap[category.toLowerCase()] ?? '/favicon.ico';
  }

  // Data Loading
  protected retryAllLoading(): void {
    this.checkBackendConnection();
    this.loadCategories();
    this.loadFeaturedProducts();
    this.loadNewArrivals();
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

    this.productsApiService
      .getHomeFeaturedProducts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.featuredProductsState.update((state) => ({ ...state, loading: false }));
        })
      )
      .subscribe({
        next: (products) => {
          const mappedProducts = products.slice(0, 4).map((product) => {
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

  private loadNewArrivals(): void {
    this.newArrivalsState.set({
      data: [],
      error: null,
      loading: true
    });

    this.productsApiService
      .getHomeNewArrivals()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.newArrivalsState.update((state) => ({ ...state, loading: false }));
        })
      )
      .subscribe({
        next: (products) => {
          const mappedProducts = products.slice(0, 4).map((product) => {
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

          this.newArrivalsState.set({
            data: mappedProducts,
            error: null,
            loading: false
          });
        },
        error: (error: AppHttpError) => {
          this.newArrivalsState.set({
            data: [],
            error: error.message || 'Could not load new arrivals.',
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
