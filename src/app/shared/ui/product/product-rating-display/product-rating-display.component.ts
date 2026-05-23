import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-rating-display',
  templateUrl: './product-rating-display.component.html',
  styleUrl: './product-rating-display.component.scss'
})
export class ProductRatingDisplayComponent {
  @Input() rating = 0;
  @Input() reviewCount = 0;

  protected readonly stars = Array.from({ length: 5 }, (_, index) => index + 1);

  protected isFilled(star: number): boolean {
    return this.rating >= star;
  }
}
