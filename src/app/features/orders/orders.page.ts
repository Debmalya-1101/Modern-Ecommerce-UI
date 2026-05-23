import { Component } from '@angular/core';

import { RoutePlaceholderComponent } from '../../shared/ui/route-placeholder/route-placeholder.component';

@Component({
  selector: 'app-orders-page',
  imports: [RoutePlaceholderComponent],
  template: `
    <app-route-placeholder
      eyebrow="Orders feature route"
      title="Orders placeholder"
      description="This route will later list past orders and link to order details or payment retry flows."
      [highlights]="highlights"
    />
  `
})
export class OrdersPage {
  protected readonly highlights = [
    'Ready for a protected order history screen',
    'Can later map directly to the backend /api/orders endpoints',
    'Keeps user order history separate from checkout workflow'
  ];
}
