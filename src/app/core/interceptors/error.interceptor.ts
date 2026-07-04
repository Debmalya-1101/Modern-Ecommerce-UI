import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { normalizeApiError } from '../utils/api-error.util';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * Auth-aware error interceptor.
 *
 * On a 401 response from any *non-auth* endpoint, transparently attempts to
 * refresh the access token using the HttpOnly cookie and retries the request.
 *
 * Auth endpoints (/auth/login, /auth/refresh, /auth/logout) are excluded from
 * the retry logic to prevent infinite loops.
 */
export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  // URLs that must never trigger the 401 retry / refresh loop
  const isAuthEndpoint =
    request.url.includes(API_ENDPOINTS.auth.login) ||
    request.url.includes(API_ENDPOINTS.auth.refresh) ||
    request.url.includes(API_ENDPOINTS.auth.logout);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthEndpoint) {
        // Regular API call returned 401 — silently refresh and retry
        return handle401Error(request, next, authService);
      }

      // For auth endpoints that returned 401, just pass the error through.
      // auth.service.ts handles the local state cleanup via clearLocalSession().
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
        // refreshSession() already cleared local state — just propagate the error
        return throwError(() => normalizeApiError(err));
      })
    );
  } else {
    // A refresh is already in flight — queue this request until it completes
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
