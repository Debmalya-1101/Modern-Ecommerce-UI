import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, retry, throwError, timer } from 'rxjs';
import { ColdStartService } from '../services/cold-start.service';

let pendingRequests = 0;

export const coldStartInterceptor: HttpInterceptorFn = (req, next) => {
  const coldStartService = inject(ColdStartService);

  // Skip the 10-second cold-start timer for chatbot/LLM calls so long responses don't trigger the waking up banner
  const isChatbotRequest = req.url.includes('/chatbot');

  pendingRequests++;
  let resolved = false;

  let timeoutId: any = null;
  if (!isChatbotRequest) {
    timeoutId = setTimeout(() => {
      if (!resolved) {
        coldStartService.setColdStarting(true);
      }
    }, 10000);
  }

  return next(req).pipe(
    retry({
      count: 20, // 20 attempts * 15 seconds = 300 seconds of retrying
      delay: (error: HttpErrorResponse) => {
        if (error.status === 0 || error.status === 502 || error.status === 503 || error.status === 504) {
          // If we hit a true connection error, show the banner and retry
          coldStartService.setColdStarting(true);
          return timer(15000); // 15 second delay between retries
        }
        return throwError(() => error);
      }
    }),
    finalize(() => {
      resolved = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      pendingRequests--;
      if (pendingRequests === 0) {
        coldStartService.setColdStarting(false);
      }
    })
  );
};
