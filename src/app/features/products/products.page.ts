import { TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AppHttpError, createInitialRequestState } from '../../core/models/api.model';
import {
  ProductCatalogPreviewState,
  ProductsApiService
} from '../../core/services/products-api.service';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { ProductGridComponent } from '../../shared/ui/product/product-grid/product-grid.component';
import { ProductSkeletonLoadingComponent } from '../../shared/ui/product/product-skeleton-loading/product-skeleton-loading.component';
import { ProductCardViewModel } from '../../shared/ui/product/product-ui.model';

type BadgeFilter = 'all' | 'sale' | 'new';

interface CatalogFilters {
  searchTerm: string;
  category: string;
  badge: BadgeFilter;
  previewState: ProductCatalogPreviewState;
}

@Component({
  selector: 'app-products-page',
  imports: [
    TitleCasePipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ButtonStyleDirective,
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
  private readonly productState = signal(createInitialRequestState<ProductCardViewModel[]>([]));
  private readonly defaultFilters: CatalogFilters = {
    searchTerm: '',
    category: 'all',
    badge: 'all',
    previewState: 'live'
  };

  protected readonly filters = signal<CatalogFilters>(this.defaultFilters);
  protected readonly searchDraft = signal('');
  protected readonly categoryOptions = signal<string[]>(
    this.productsApiService.getCatalogCategories()
  );
  protected readonly previewStateOptions: ProductCatalogPreviewState[] = ['live', 'empty', 'error'];
  protected readonly badgeOptions: BadgeFilter[] = ['all', 'sale', 'new'];
  protected readonly products = this.productState.asReadonly();
  protected readonly productCountLabel = computed(() => {
    const count = this.products().data?.length ?? 0;
    return count === 1 ? '1 product' : `${count} products`;
  });
  protected readonly activeFilterSummary = computed(() => {
    const filters = this.filters();
    const summary: string[] = [];

    if (filters.category !== 'all') {
      summary.push(filters.category);
    }

    if (filters.badge !== 'all') {
      summary.push(filters.badge === 'sale' ? 'Sale' : 'New');
    }

    if (filters.searchTerm) {
      summary.push(`"${filters.searchTerm}"`);
    }

    return summary.length ? summary.join(' | ') : 'All categories';
  });

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const filters = this.mapQueryParamsToFilters({
          searchTerm: params.get('q') ?? '',
          category: params.get('category') ?? 'all',
          badge: params.get('badge') ?? 'all',
          previewState: params.get('state') ?? 'live'
        });

        this.filters.set(filters);
        this.searchDraft.set(filters.searchTerm);
        this.loadProducts(filters);
      });
  }

  protected showQuickView(productId: number): void {
    this.snackbarService.info(`Mock quick view for product #${productId}.`);
  }

  protected reloadProducts(): void {
    this.loadProducts(this.filters());
  }

  protected applySearch(): void {
    this.updateCatalogFilters({
      searchTerm: this.searchDraft().trim()
    });
  }

  protected clearSearch(): void {
    this.searchDraft.set('');
    this.updateCatalogFilters({
      searchTerm: ''
    });
  }

  protected changeCategory(category: string): void {
    this.updateCatalogFilters({ category });
  }

  protected changeBadge(badge: BadgeFilter): void {
    this.updateCatalogFilters({ badge });
  }

  protected changePreviewState(previewState: ProductCatalogPreviewState): void {
    this.updateCatalogFilters({ previewState });
  }

  protected clearFilters(): void {
    this.searchDraft.set('');
    this.updateCatalogFilters(this.defaultFilters);
  }

  private loadProducts(filters: CatalogFilters): void {
    this.productState.set({
      data: this.productState().data,
      error: null,
      loading: true
    });

    this.productsApiService
      .getProducts({
        searchTerm: filters.searchTerm,
        category: filters.category === 'all' ? undefined : filters.category,
        badge: filters.badge === 'all' ? undefined : filters.badge,
        previewState: filters.previewState
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.productState.update((state) => ({
            ...state,
            loading: false
          }));
        })
      )
      .subscribe({
        next: (products) => {
          this.productState.set({
            data: products.map((product) => ({
              id: product.id,
              name: product.name,
              brand: product.brand,
              category: product.categoryName,
              shortDescription: product.shortDescription,
              price: product.price,
              originalPrice: product.originalPrice,
              rating: product.rating,
              reviewCount: product.reviewCount,
              badge: product.badge,
              imageLabel: product.imageLabel
            })),
            error: null,
            loading: false
          });
        },
        error: (error: AppHttpError) => {
          this.productState.set({
            data: [],
            error: error.message,
            loading: false
          });
        }
      });
  }

  private updateCatalogFilters(changes: Partial<CatalogFilters>): void {
    const nextFilters = {
      ...this.filters(),
      ...changes
    };

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: nextFilters.searchTerm || null,
        category: nextFilters.category !== 'all' ? nextFilters.category : null,
        badge: nextFilters.badge !== 'all' ? nextFilters.badge : null,
        state: nextFilters.previewState !== 'live' ? nextFilters.previewState : null
      }
    });
  }

  private mapQueryParamsToFilters(queryParams: {
    searchTerm: string;
    category: string;
    badge: string;
    previewState: string;
  }): CatalogFilters {
    const badge = queryParams.badge.toLowerCase();
    const previewState = queryParams.previewState.toLowerCase();

    return {
      searchTerm: queryParams.searchTerm.trim(),
      category: queryParams.category.trim() || 'all',
      badge: badge === 'sale' || badge === 'new' ? badge : 'all',
      previewState: previewState === 'empty' || previewState === 'error' ? previewState : 'live'
    };
  }
}
