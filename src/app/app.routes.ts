import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'oauth2/callback',
    loadComponent: () =>
      import('./features/auth/oauth2-callback.page').then((m) => m.Oauth2CallbackPage)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup.page').then((m) => m.SignupPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password.page').then((m) => m.ForgotPasswordPage)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password.page').then((m) => m.ResetPasswordPage)
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/home/home.routes').then((m) => m.HOME_ROUTES)
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES)
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./features/cart/cart.routes').then((m) => m.CART_ROUTES)
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./features/checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES)
  },
  {
    path: 'payment',
    loadChildren: () =>
      import('./features/payment/payment.routes').then((m) => m.PAYMENT_ROUTES)
  },
  {
    path: 'order-success',
    loadComponent: () =>
      import('./features/checkout/order-success.page').then((m) => m.OrderSuccessPage)
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/orders/orders.routes').then((m) => m.ORDERS_ROUTES)
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES)
  },
  {
    path: 'wishlist',
    loadChildren: () =>
      import('./features/wishlist/wishlist.routes').then((m) => m.routes)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
  {
    path: 'delivery-partner',
    loadChildren: () =>
      import('./features/delivery-partner/delivery-partner.routes').then((m) => m.DELIVERY_PARTNER_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
