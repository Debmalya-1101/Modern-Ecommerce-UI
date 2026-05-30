import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: {
        redirectTo: state.url
      }
    });
  }

  if (authService.hasRole('ROLE_ADMIN')) {
    return true;
  }

  return router.createUrlTree(['/profile']);
};
