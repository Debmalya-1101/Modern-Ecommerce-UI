import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';

export const CHECKOUT_ROUTES: Routes = [
  {
    canActivate: [authGuard],
    path: '',
    loadComponent: () => import('./checkout.page').then((m) => m.CheckoutPage)
  }
];
