import { Component } from '@angular/core';

import { RoutePlaceholderComponent } from '../../shared/ui/route-placeholder/route-placeholder.component';

@Component({
  selector: 'app-cart-page',
  imports: [RoutePlaceholderComponent],
  template: `
    <app-route-placeholder
      eyebrow="Cart feature route"
      title="Cart placeholder"
      description="This route will later show cart items, totals, quantity updates, and remove actions."
      [highlights]="highlights"
    />
  `
})
export class CartPage {
  protected readonly highlights = [
    'Protected route shape is already planned by the backend API reference',
    'Ready for cart item list, cart total, and quantity controls',
    'Can later reuse shared loading, empty, and error state components'
  ];
}
