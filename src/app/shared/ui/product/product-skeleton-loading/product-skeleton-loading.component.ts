import { Component, Input } from '@angular/core';

import { SkeletonLoaderComponent } from '../../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-product-skeleton-loading',
  imports: [SkeletonLoaderComponent],
  templateUrl: './product-skeleton-loading.component.html',
  styleUrl: './product-skeleton-loading.component.scss'
})
export class ProductSkeletonLoadingComponent {
  @Input() cards = 4;

  protected get placeholders(): number[] {
    return Array.from({ length: this.cards }, (_, index) => index);
  }
}
