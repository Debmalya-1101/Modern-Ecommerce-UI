import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { finalize } from 'rxjs';

import { AppHttpError, createInitialRequestState } from '../../core/models/api.model';
import { ProductListItem } from '../../core/models/product.model';
import { ProductsApiService } from '../../core/services/products-api.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { ProductGridComponent } from '../../shared/ui/product/product-grid/product-grid.component';
import { ProductSkeletonLoadingComponent } from '../../shared/ui/product/product-skeleton-loading/product-skeleton-loading.component';
import { ProductCardViewModel } from '../../shared/ui/product/product-ui.model';

@Component({
  selector: 'app-products-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
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
  private readonly productsApiService = inject(ProductsApiService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly productState = signal(createInitialRequestState<ProductCardViewModel[]>([]));

  protected readonly categoryHighlights = signal<string[]>([]);

  ngOnInit(): void {
    this.loadProducts();
  }

  protected readonly products = this.productState.asReadonly();

  protected showQuickView(productId: number): void {
    this.snackbarService.info(`Mock quick view for product #${productId}.`);
  }

  protected reloadProducts(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productState.set({
      data: this.productState().data,
      error: null,
      loading: true
    });

    this.productsApiService
      .getProducts()
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
          const productCards = products.map((product) => this.mapProductToCardViewModel(product));

          this.categoryHighlights.set(this.createCategoryHighlights(products));
          this.productState.set({
            data: productCards,
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

  private mapProductToCardViewModel(product: ProductListItem): ProductCardViewModel {
    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.categoryName,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating,
      reviewCount: product.reviewCount,
      badge: product.badge,
      imageLabel: product.imageLabel
    };
  }

  private createCategoryHighlights(products: ProductListItem[]): string[] {
    return products
      .map((product) => product.categoryName)
      .filter((category, index, categories) => categories.indexOf(category) === index)
      .slice(0, 3);
  }
}
