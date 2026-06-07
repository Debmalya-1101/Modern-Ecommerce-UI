import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/admin-dashboard.page').then((m) => m.AdminDashboardPage)
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./analytics/admin-analytics.page').then((m) => m.AdminAnalyticsPage)
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/admin-products.page').then((m) => m.AdminProductsPage)
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./orders/admin-orders.page').then((m) => m.AdminOrdersPage)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./categories/admin-categories.page').then((m) => m.AdminCategoriesPage)
      }
    ]
  }
];
