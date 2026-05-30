import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';

export const PROFILE_ROUTES: Routes = [
  {
    canActivate: [authGuard],
    path: '',
    loadComponent: () => import('./profile.page').then((m) => m.ProfilePage)
  }
];
