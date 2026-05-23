import { Component } from '@angular/core';

import { RoutePlaceholderComponent } from '../../shared/ui/route-placeholder/route-placeholder.component';

@Component({
  selector: 'app-products-page',
  imports: [RoutePlaceholderComponent],
  template: `
    <app-route-placeholder
      eyebrow="Products feature route"
      title="Products listing placeholder"
      description="This route will later hold filters, sorting, pagination, and product cards."
      [highlights]="highlights"
    />
  `
})
export class ProductsPage {
  protected readonly highlights = [
    'Public product list route from the backend contract',
    'Ready for query parameters such as page, size, search, category, and brand',
    'Separated from product details so each route can stay focused'
  ];
}
