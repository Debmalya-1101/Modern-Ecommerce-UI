import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AppHttpError } from '../models/api.model';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
      }

      const appError = new AppHttpError(
        extractErrorMessage(error),
        error.status,
        error.error
      );

      return throwError(() => appError);
    })
  );
};

function extractErrorMessage(error: HttpErrorResponse): string {
  const errorBody = error.error;

  if (typeof errorBody === 'string' && errorBody.trim()) {
    return errorBody;
  }

  if (errorBody?.message) {
    return errorBody.message;
  }

  if (error.status === 0) {
    return 'Could not connect to the backend server.';
  }

  if (error.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error.status === 404) {
    return 'The requested resource was not found.';
  }

  return 'Something went wrong while talking to the backend.';
}
