import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

const publicPaths = ['/auth/login', '/auth/signup'];
const publicPrefixes = ['/api/products'];

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token || isPublicRequest(request.url)) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};

function isPublicRequest(url: string): boolean {
  return publicPaths.some((path) => url.includes(path))
    || publicPrefixes.some((prefix) => url.includes(prefix));
}
