import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { SnackbarService } from '../../shared/services/snackbar.service';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
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
    ProductGridComponent,
    ProductSkeletonLoadingComponent
  ],
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss'
})
export class ProductsPage {
  private readonly snackbarService = inject(SnackbarService);

  protected readonly featuredProducts: ProductCardViewModel[] = [
    {
      id: 101,
      name: 'Luma Carry Pro Backpack',
      brand: 'Northline',
      category: 'Backpacks',
      price: 3499,
      originalPrice: 4999,
      rating: 4.7,
      reviewCount: 184,
      badge: 'Best Seller',
      imageLabel: 'Travel backpack'
    },
    {
      id: 102,
      name: 'Aero Noise-Lite Headphones',
      brand: 'Sonica',
      category: 'Audio',
      price: 7999,
      originalPrice: 9999,
      rating: 4.4,
      reviewCount: 92,
      badge: 'New Arrival',
      imageLabel: 'Wireless headphones'
    },
    {
      id: 103,
      name: 'Oak & Ember Desk Lamp',
      brand: 'Hearth Studio',
      category: 'Home',
      price: 2199,
      originalPrice: 2899,
      rating: 4.6,
      reviewCount: 48,
      badge: 'Editor Pick',
      imageLabel: 'Desk lamp'
    },
    {
      id: 104,
      name: 'Stride Everyday Sneakers',
      brand: 'Motive',
      category: 'Footwear',
      price: 4299,
      originalPrice: 5499,
      rating: 4.3,
      reviewCount: 126,
      imageLabel: 'Sneakers'
    }
  ];

  protected readonly categoryHighlights = [
    'Smart accessories',
    'Home upgrades',
    'Travel essentials'
  ];

  protected showQuickView(productId: number): void {
    this.snackbarService.info(`Mock quick view for product #${productId}.`);
  }
}
