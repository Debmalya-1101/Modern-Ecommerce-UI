import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./cart.page').then((m) => m.CartPage),
    canActivate: [authGuard]
  }
];
