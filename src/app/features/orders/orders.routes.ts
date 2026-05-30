import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';

export const ORDERS_ROUTES: Routes = [
  {
    canActivate: [authGuard],
    path: '',
    loadComponent: () => import('./orders.page').then((m) => m.OrdersPage)
  }
];
