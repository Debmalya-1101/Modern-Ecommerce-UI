import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RoutePlaceholderComponent } from '../../shared/ui/route-placeholder/route-placeholder.component';

@Component({
  selector: 'app-product-details-page',
  imports: [RoutePlaceholderComponent],
  template: `
    <app-route-placeholder
      eyebrow="Product details route"
      [title]="'Product details placeholder for item #' + productId"
      description="This dynamic route is ready for a future product details screen backed by a product id."
      [highlights]="highlights"
    />
  `
})
export class ProductDetailsPage {
  private readonly route = inject(ActivatedRoute);

  protected readonly productId = this.route.snapshot.paramMap.get('id') ?? 'unknown';
  protected readonly highlights = [
    'Dynamic route shape: /products/:id',
    'Ready for product detail data, gallery content, and review sections later',
    'Keeps route organization similar to a backend endpoint with a path variable'
  ];
}
