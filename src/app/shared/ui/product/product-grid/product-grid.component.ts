import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductCardViewModel } from '../product-ui.model';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCardComponent],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss'
})
export class ProductGridComponent {
  @Input() products: ProductCardViewModel[] = [];
  @Output() quickView = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<number>();

  protected handleQuickView(productId: number): void {
    this.quickView.emit(productId);
  }

  protected handleAddToCart(productId: number): void {
    this.addToCart.emit(productId);
  }
}
