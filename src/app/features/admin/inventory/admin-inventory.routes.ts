import { Routes } from '@angular/router';

export const ADMIN_INVENTORY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-inventory-list.page').then((m) => m.AdminInventoryListPage)
  },
  {
    path: ':productId',
    loadComponent: () =>
      import('./admin-inventory-detail.page').then((m) => m.AdminInventoryDetailPage)
  }
];
