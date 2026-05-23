import { Component } from '@angular/core';

import { RoutePlaceholderComponent } from '../../shared/ui/route-placeholder/route-placeholder.component';

@Component({
  selector: 'app-checkout-page',
  imports: [RoutePlaceholderComponent],
  template: `
    <app-route-placeholder
      eyebrow="Checkout feature route"
      title="Checkout placeholder"
      description="This route will later hold address details, order summary, and payment initiation flow."
      [highlights]="highlights"
    />
  `
})
export class CheckoutPage {
  protected readonly highlights = [
    'Ready for a checkout form and order summary layout',
    'Can later connect to checkout and payment backend endpoints',
    'Separate route keeps checkout isolated from cart and orders'
  ];
}
