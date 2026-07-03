import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { normalizeApiError } from '../utils/api-error.util';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        !request.url.includes(API_ENDPOINTS.auth.login) &&
        !request.url.includes(API_ENDPOINTS.auth.refresh)
      ) {
        return handle401Error(request, next, authService);
      }

      if (error.status === 401 && request.url.includes(API_ENDPOINTS.auth.refresh)) {
        authService.logout();
      }

      return throwError(() => normalizeApiError(error));
    })
  );
};

function handle401Error(request: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshSession().pipe(
      switchMap((tokenResponse) => {
        isRefreshing = false;
        refreshTokenSubject.next(tokenResponse.accessToken);
        return next(
          request.clone({
            setHeaders: {
              Authorization: `Bearer ${tokenResponse.accessToken}`
            }
          })
        );
      }),
      catchError((err) => {
        isRefreshing = false;
        return throwError(() => normalizeApiError(err));
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((jwt) => {
        return next(
          request.clone({
            setHeaders: {
              Authorization: `Bearer ${jwt}`
            }
          })
        );
      })
    );
  }
}
