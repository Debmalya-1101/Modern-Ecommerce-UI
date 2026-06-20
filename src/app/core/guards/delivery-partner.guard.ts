import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const deliveryPartnerGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: {
        redirectTo: state.url
      }
    });
  }

  if (authService.hasRole('ROLE_DELIVERY_PARTNER')) {
    return true;
  }

  return router.createUrlTree(['/profile']);
};
