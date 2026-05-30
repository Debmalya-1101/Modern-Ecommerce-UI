import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { AuthService } from '../services/auth.service';

const publicPaths = [
  API_ENDPOINTS.auth.login,
  API_ENDPOINTS.auth.signup
];
const publicPrefixes = [
  API_ENDPOINTS.products.list
];

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

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
