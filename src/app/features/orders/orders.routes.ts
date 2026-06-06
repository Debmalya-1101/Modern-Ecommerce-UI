import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';

export const ORDERS_ROUTES: Routes = [
  {
    canActivate: [authGuard],
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./orders.page').then((m) => m.OrdersPage)
      },
      {
        path: ':id',
        loadComponent: () => import('./order-detail.page').then((m) => m.OrderDetailPage)
      }
    ]
  }
];
