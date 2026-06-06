import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AppHttpError, createInitialRequestState } from '../../core/models/api.model';
import { ProductCatalogQuery, ProductsApiService } from '../../core/services/products-api.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { ProductGridComponent } from '../../shared/ui/product/product-grid/product-grid.component';
import { ProductSkeletonLoadingComponent } from '../../shared/ui/product/product-skeleton-loading/product-skeleton-loading.component';
import { ProductCardViewModel } from '../../shared/ui/product/product-ui.model';

/**
 * Active filter values applied to the product catalog.
 * These map 1-to-1 with URL query params so the page is bookmark/refresh safe.
 */
interface CatalogFilters {
  searchTerm: string;
  category: string;
}

@Component({
  selector: 'app-products-page',
  imports: [
    MatIconModule,
    EmptyStateComponent,
    ErrorStateComponent,
    ProductGridComponent,
    ProductSkeletonLoadingComponent
  ],
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss'
})
export class ProductsPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsApiService = inject(ProductsApiService);
  private readonly snackbarService = inject(SnackbarService);

  // Holds the current product list state: loading flag, error message, or data
  private readonly productState = signal(createInitialRequestState<ProductCardViewModel[]>([]));

  private readonly defaultFilters: CatalogFilters = {
    searchTerm: '',
    category: 'all',
  };

  // --- Public signals and computed values read by the template ---

  protected readonly filters = signal<CatalogFilters>(this.defaultFilters);

  // Tracks what is typed in the search box before the user presses Search
  protected readonly searchDraft = signal('');

  // Category chips — starts empty, populated from the backend on init
  protected readonly categoryOptions = signal<string[]>([]);

  // Exposes product state as read-only to the template
  protected readonly products = this.productState.asReadonly();

  // Shows "1 product" or "12 products" in the hero stat card
  protected readonly productCountLabel = computed(() => {
    const count = this.products().data?.length ?? 0;
    return count === 1 ? '1 product' : `${count} products`;
  });

  // Shows the currently active filter combination as a summary string
  protected readonly activeFilterSummary = computed(() => {
    const filters = this.filters();
    const summary: string[] = [];

    if (filters.category !== 'all') {
      summary.push(filters.category);
    }

    if (filters.searchTerm) {
      summary.push(`"${filters.searchTerm}"`);
    }

    return summary.length ? summary.join(' | ') : 'All products';
  });

  ngOnInit(): void {
    // Load category chips once on page load — runs silently in the background
    this.loadCategories();

    // React to URL query param changes so browser back/forward and
    // refresh all work correctly (the URL is the source of truth for filters)
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const filters = this.mapQueryParamsToFilters({
          searchTerm: params.get('q') ?? '',
          category: params.get('category') ?? 'all',
        });

        this.filters.set(filters);
        this.searchDraft.set(filters.searchTerm);
        this.loadProducts(filters);
      });
  }

  // --- Template event handlers ---

  protected showQuickView(productId: number): void {
    this.snackbarService.info(`Quick view for product #${productId} is coming soon.`);
  }

  protected reloadProducts(): void {
    this.loadProducts(this.filters());
  }

  protected applySearch(): void {
    this.updateCatalogFilters({ searchTerm: this.searchDraft().trim() });
  }

  protected clearSearch(): void {
    this.searchDraft.set('');
    this.updateCatalogFilters({ searchTerm: '' });
  }

  protected changeCategory(category: string): void {
    this.updateCatalogFilters({ category });
  }

  protected clearFilters(): void {
    this.searchDraft.set('');
    this.updateCatalogFilters(this.defaultFilters);
  }

  // --- Private helpers ---

  /**
   * Fetches the product list from the backend and updates the product state signal.
   * Shows the loading skeleton while the request is in flight.
   */
  private loadProducts(filters: CatalogFilters): void {
    // Show loading skeleton while keeping the previous data visible underneath
    this.productState.set({
      data: this.productState().data,
      error: null,
      loading: true,
    });

    const query: ProductCatalogQuery = {
      searchTerm: filters.searchTerm || undefined,
      category: filters.category !== 'all' ? filters.category : undefined,
    };

    this.productsApiService
      .getProducts(query)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          // Always clear the loading flag, even if the request failed
          this.productState.update((state) => ({ ...state, loading: false }));
        })
      )
      .subscribe({
        next: (products) => {
          // Map backend ProductListItem → ProductCardViewModel for the grid component.
          // Fields not provided by the backend (reviewCount, imageLabel) use safe defaults.
          this.productState.set({
            data: products.map((product) => ({
              id: product.id,
              name: product.name,
              brand: product.brand,
              category: product.categoryName,
              price: product.price,
              rating: product.rating,
              imageUrl: product.imageUrl,     // Real image URL from the backend
              reviewCount: 0,                 // Backend list API does not return review count
              imageLabel: product.name,       // Use product name as the image alt text
              shortDescription: product.shortDescription,
              badge: product.badge,
              originalPrice: product.originalPrice,
            })),
            error: null,
            loading: false,
          });
        },
        error: (error: AppHttpError) => {
          this.productState.set({
            data: [],
            error: error.message,
            loading: false,
          });
        },
      });
  }

  /**
   * Fetches available categories from the backend and populates the category chips.
   * Uses trackLoading: false so it runs silently without triggering the product skeleton.
   * Fails silently — if this call errors, the chips just remain hidden.
   */
  private loadCategories(): void {
    this.productsApiService
      .getCatalogCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => this.categoryOptions.set(categories),
        error: () => {
          // Categories are a nice-to-have — a failure here does not block the page
        },
      });
  }

  /**
   * Updates the URL query params to reflect the new filter values.
   * Angular Router will re-trigger the queryParamMap subscription, which
   * in turn calls loadProducts() — keeping the URL as the single source of truth.
   */
  private updateCatalogFilters(changes: Partial<CatalogFilters>): void {
    const nextFilters = { ...this.filters(), ...changes };

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: nextFilters.searchTerm || null,
        category: nextFilters.category !== 'all' ? nextFilters.category : null,
      },
    });
  }

  /**
   * Converts raw URL query param strings into a typed CatalogFilters object.
   * Handles missing or invalid values by applying safe defaults.
   */
  private mapQueryParamsToFilters(queryParams: {
    searchTerm: string;
    category: string;
  }): CatalogFilters {
    return {
      searchTerm: queryParams.searchTerm.trim(),
      category: queryParams.category.trim() || 'all',
    };
  }
}
