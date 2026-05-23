import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-price-display',
  imports: [CurrencyPipe],
  templateUrl: './product-price-display.component.html',
  styleUrl: './product-price-display.component.scss'
})
export class ProductPriceDisplayComponent {
  @Input() price = 0;
  @Input() originalPrice?: number | null;
  @Input() currencyCode = 'INR';

  protected get discountPercentage(): number | null {
    if (!this.originalPrice || this.originalPrice <= this.price) {
      return null;
    }

    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
}
