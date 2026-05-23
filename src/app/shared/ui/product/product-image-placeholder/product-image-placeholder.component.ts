import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-image-placeholder',
  templateUrl: './product-image-placeholder.component.html',
  styleUrl: './product-image-placeholder.component.scss'
})
export class ProductImagePlaceholderComponent {
  @Input() label = 'Product image';
}
