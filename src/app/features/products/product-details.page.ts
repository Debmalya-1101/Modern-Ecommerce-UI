import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AppHttpError, createInitialRequestState } from '../../core/models/api.model';
import { ProductDetail } from '../../core/models/product.model';
import { ProductsApiService } from '../../core/services/products-api.service';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';
import { ProductBadgeComponent } from '../../shared/ui/product/product-badge/product-badge.component';
import { ProductCategoryChipComponent } from '../../shared/ui/product/product-category-chip/product-category-chip.component';
import { ProductImagePlaceholderComponent } from '../../shared/ui/product/product-image-placeholder/product-image-placeholder.component';
import { ProductPriceDisplayComponent } from '../../shared/ui/product/product-price-display/product-price-display.component';
import { ProductRatingDisplayComponent } from '../../shared/ui/product/product-rating-display/product-rating-display.component';

@Component({
  selector: 'app-product-details-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    RouterLink,
    ButtonStyleDirective,
    ErrorStateComponent,
    LoadingSpinnerComponent,
    ProductBadgeComponent,
    ProductCategoryChipComponent,
    ProductImagePlaceholderComponent,
    ProductPriceDisplayComponent,
    ProductRatingDisplayComponent
  ],
  templateUrl: './product-details.page.html',
  styleUrl: './product-details.page.scss'
})
export class ProductDetailsPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly productsApiService = inject(ProductsApiService);

  private readonly productState = signal(createInitialRequestState<ProductDetail>());
  protected readonly productId = signal<number | null>(null);
  protected readonly product = this.productState.asReadonly();

  ngOnInit(): void {
    this.loadProductFromRoute();
  }

  protected reloadProduct(): void {
    this.loadProductFromRoute();
  }

  private loadProductFromRoute(): void {
    const routeId = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isNaN(routeId)) {
      this.productId.set(null);
      this.productState.set({
        data: null,
        error: 'The product id in the URL is not valid.',
        loading: false
      });
      return;
    }

    this.productId.set(routeId);
    this.productState.set({
      data: null,
      error: null,
      loading: true
    });

    this.productsApiService
      .getProductDetail(routeId)
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
        next: (productDetail) => {
          this.productState.set({
            data: productDetail,
            error: null,
            loading: false
          });
        },
        error: (error: AppHttpError) => {
          this.productState.set({
            data: null,
            error: error.message,
            loading: false
          });
        }
      });
  }
}
