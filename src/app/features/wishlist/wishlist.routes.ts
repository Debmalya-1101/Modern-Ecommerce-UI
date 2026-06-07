import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./wishlist.page').then((m) => m.WishlistPage),
    title: 'My Wishlist | Modern E-commerce'
  }
];
