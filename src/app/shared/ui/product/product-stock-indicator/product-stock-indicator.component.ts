import { Component, Input } from '@angular/core';

import { ProductStockStatus } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-stock-indicator',
  templateUrl: './product-stock-indicator.component.html',
  styleUrl: './product-stock-indicator.component.scss'
})
export class ProductStockIndicatorComponent {
  @Input() status: ProductStockStatus = 'in-stock';
  @Input() label = 'In stock';
}
