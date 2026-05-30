import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

import { ButtonStyleDirective } from '../../../directives/button-style.directive';
import { ProductBadgeComponent } from '../product-badge/product-badge.component';
import { ProductCategoryChipComponent } from '../product-category-chip/product-category-chip.component';
import { ProductImagePlaceholderComponent } from '../product-image-placeholder/product-image-placeholder.component';
import { ProductPriceDisplayComponent } from '../product-price-display/product-price-display.component';
import { ProductRatingDisplayComponent } from '../product-rating-display/product-rating-display.component';
import { ProductCardViewModel } from '../product-ui.model';

@Component({
  selector: 'app-product-card',
  imports: [
    MatButtonModule,
    MatCardModule,
    RouterLink,
    ButtonStyleDirective,
    ProductBadgeComponent,
    ProductCategoryChipComponent,
    ProductImagePlaceholderComponent,
    ProductPriceDisplayComponent,
    ProductRatingDisplayComponent
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductCardViewModel;
  @Output() quickView = new EventEmitter<number>();

  protected openQuickView(): void {
    this.quickView.emit(this.product.id);
  }
}
