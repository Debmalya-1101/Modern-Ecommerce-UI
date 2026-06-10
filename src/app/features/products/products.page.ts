import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AppHttpError, createInitialRequestState } from '../../core/models/api.model';
import { ProductCatalogQuery, ProductsApiService } from '../../core/services/products-api.service';
import { CartService } from '../../core/services/cart.service';
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
  brand: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
  order: string;
  page: number;
  size: number;
}

@Component({
  selector: 'app-products-page',
  imports: [
    FormsModule,
    MatIconModule,
    MatPaginatorModule,
    MatSidenavModule,
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
  private readonly cartService = inject(CartService);

  // Holds the current product list state: loading flag, error message, or data
  private readonly productState = signal(createInitialRequestState<ProductCardViewModel[]>([]));

  private readonly defaultFilters: CatalogFilters = {
    searchTerm: '',
    category: 'all',
    brand: 'all',
    minPrice: null,
    maxPrice: null,
    sortBy: 'createdAt',
    order: 'desc',
    page: 0,
    size: 12,
  };

  // --- Public signals and computed values read by the template ---

  protected readonly filters = signal<CatalogFilters>(this.defaultFilters);

  // Tracks what is typed in the search box before the user presses Search
  protected readonly searchDraft = signal('');

  // Category and brand chips — starts empty, populated from the backend on init
  protected readonly categoryOptions = signal<string[]>([]);
  protected readonly brandOptions = signal<string[]>([]);

  // UI state for filter drawer
  protected readonly showFilterDrawer = signal(false);

  // Total elements from paginated response
  protected readonly totalElements = signal(0);

  // Exposes product state as read-only to the template
  protected readonly products = this.productState.asReadonly();

  // Shows "1 product" or "12 products" in the hero stat card
  protected readonly productCountLabel = computed(() => {
    const count = this.totalElements();
    return count === 1 ? '1 product' : `${count} products`;
  });

  // Shows the currently active filter combination as a summary string
  protected readonly activeFilterSummary = computed(() => {
    const filters = this.filters();
    const summary: string[] = [];

    if (filters.category !== 'all') {
      summary.push(filters.category);
    }

    if (filters.brand !== 'all') {
      summary.push(filters.brand);
    }

    if (filters.minPrice !== null || filters.maxPrice !== null) {
      summary.push('Price filtered');
    }

    if (filters.searchTerm) {
      summary.push(`"${filters.searchTerm}"`);
    }

    return summary.length ? summary.join(' | ') : 'All products';
  });

  ngOnInit(): void {
    // Load options once on page load — runs silently in the background
    this.loadCategories();
    this.loadBrands();

    // React to URL query param changes so browser back/forward and
    // refresh all work correctly (the URL is the source of truth for filters)
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const filters = this.mapQueryParamsToFilters(params);

        this.filters.set(filters);
        this.searchDraft.set(filters.searchTerm);
        this.loadProducts(filters);
      });
  }

  // --- Template event handlers ---

  protected showQuickView(productId: number): void {
    this.snackbarService.info(`Quick view for product #${productId} is coming soon.`);
  }

  protected addToCart(productId: number): void {
    this.cartService.addToCart(productId, 1);
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

  protected toggleFilterDrawer(): void {
    this.showFilterDrawer.update(v => !v);
  }

  protected changeSort(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const [sortBy, order] = target.value.split('-');
    this.updateCatalogFilters({ sortBy, order });
  }

  protected changeBrand(brand: string): void {
    this.updateCatalogFilters({ brand });
  }

  protected updatePriceFilter(minPrice: string, maxPrice: string): void {
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    this.updateCatalogFilters({ minPrice: min, maxPrice: max });
  }

  protected onPageChange(event: PageEvent): void {
    this.updateCatalogFilters({ page: event.pageIndex, size: event.pageSize });
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
      brand: filters.brand !== 'all' ? filters.brand : undefined,
      minPrice: filters.minPrice ?? undefined,
      maxPrice: filters.maxPrice ?? undefined,
      sortBy: filters.sortBy,
      order: filters.order,
      page: filters.page,
      size: filters.size,
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
        next: (paginatedResponse) => {
          this.totalElements.set(paginatedResponse.totalElements);
          this.productState.set({
            data: paginatedResponse.products.map((product) => {
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
            }),
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
   * Fetches available brands from the backend.
   */
  private loadBrands(): void {
    this.productsApiService
      .getCatalogBrands()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (brands) => this.brandOptions.set(brands),
        error: () => {
          // Silent fail
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
    
    // Reset page to 0 if any filter besides page/size changes
    if (changes.page === undefined && changes.size === undefined) {
      nextFilters.page = 0;
    }

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: nextFilters.searchTerm || null,
        category: nextFilters.category !== 'all' ? nextFilters.category : null,
        brand: nextFilters.brand !== 'all' ? nextFilters.brand : null,
        minPrice: nextFilters.minPrice,
        maxPrice: nextFilters.maxPrice,
        sortBy: nextFilters.sortBy !== 'createdAt' ? nextFilters.sortBy : null,
        order: nextFilters.order !== 'desc' ? nextFilters.order : null,
        page: nextFilters.page > 0 ? nextFilters.page : null,
        size: nextFilters.size !== 12 ? nextFilters.size : null,
      },
    });
  }

  /**
   * Converts raw URL query param strings into a typed CatalogFilters object.
   * Handles missing or invalid values by applying safe defaults.
   */
  private mapQueryParamsToFilters(params: any): CatalogFilters {
    return {
      searchTerm: params.get('q') ?? '',
      category: params.get('category') ?? 'all',
      brand: params.get('brand') ?? 'all',
      minPrice: params.has('minPrice') ? Number(params.get('minPrice')) : null,
      maxPrice: params.has('maxPrice') ? Number(params.get('maxPrice')) : null,
      sortBy: params.get('sortBy') ?? 'createdAt',
      order: params.get('order') ?? 'desc',
      page: params.has('page') ? Number(params.get('page')) : 0,
      size: params.has('size') ? Number(params.get('size')) : 12,
    };
  }
}
