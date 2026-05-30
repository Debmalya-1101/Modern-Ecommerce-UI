import { ENVIRONMENT_INITIALIZER, Provider, inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const provideAuthInitialization = (): Provider => ({
  provide: ENVIRONMENT_INITIALIZER,
  multi: true,
  useValue: () => {
    const authService = inject(AuthService);
    authService.restoreSession();
  }
});
