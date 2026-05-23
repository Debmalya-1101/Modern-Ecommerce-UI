import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.hasToken()) {
    return router.createUrlTree(['/']);
  }

  if (authService.hasRole('ROLE_ADMIN')) {
    return true;
  }

  return router.createUrlTree(['/']);
};
