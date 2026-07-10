import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, retry, throwError, timer } from 'rxjs';
import { ColdStartService } from '../services/cold-start.service';

let pendingRequests = 0;

export const coldStartInterceptor: HttpInterceptorFn = (req, next) => {
  const coldStartService = inject(ColdStartService);

  pendingRequests++;
  let resolved = false;

  const timeoutId = setTimeout(() => {
    if (!resolved) {
      coldStartService.setColdStarting(true);
    }
  }, 4000);

  return next(req).pipe(
    retry({
      count: 20, // 20 attempts * 15 seconds = 300 seconds of retrying
      delay: (error: HttpErrorResponse) => {
        if (error.status === 0 || error.status === 502 || error.status === 503 || error.status === 504) {
          // If we hit a connection error, immediately show the banner and retry
          coldStartService.setColdStarting(true);
          return timer(15000); // 15 second delay between retries
        }
        return throwError(() => error);
      }
    }),
    finalize(() => {
      resolved = true;
      clearTimeout(timeoutId);
      pendingRequests--;
      if (pendingRequests === 0) {
        coldStartService.setColdStarting(false);
      }
    })
  );
};
