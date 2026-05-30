import { Injectable, inject } from '@angular/core';
import { Observable, delay, map, of, throwError } from 'rxjs';

import { ApiLoadingService } from './api-loading.service';
import { HttpWrapperService } from './http-wrapper.service';
import { ApiQueryParams, ApiRequestOptions, ApiResponse, MockRequestOptions } from '../models/api.model';
import { createMockApiError } from '../utils/api-error.util';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly httpWrapper = inject(HttpWrapperService);
  private readonly apiLoadingService = inject(ApiLoadingService);

  get<T>(path: string, params?: ApiQueryParams, options?: ApiRequestOptions): Observable<T> {
    return this.runRequest(this.httpWrapper.get<T>(path, {
      ...options,
      params
    }), options?.trackLoading);
  }

  post<TResponse, TBody>(path: string, body: TBody, options?: ApiRequestOptions): Observable<TResponse> {
    return this.runRequest(this.httpWrapper.post<TResponse, TBody>(path, body, options), options?.trackLoading);
  }

  put<TResponse, TBody>(path: string, body: TBody, params?: ApiQueryParams, options?: ApiRequestOptions): Observable<TResponse> {
    return this.runRequest(this.httpWrapper.put<TResponse, TBody>(path, body, {
      ...options,
      params
    }), options?.trackLoading);
  }

  patch<TResponse, TBody>(path: string, body: TBody, options?: ApiRequestOptions): Observable<TResponse> {
    return this.runRequest(this.httpWrapper.patch<TResponse, TBody>(path, body, options), options?.trackLoading);
  }

  delete<T>(path: string, params?: ApiQueryParams, options?: ApiRequestOptions): Observable<T> {
    return this.runRequest(this.httpWrapper.delete<T>(path, {
      ...options,
      params
    }), options?.trackLoading);
  }

  mockResponse<T>(data: T, options?: MockRequestOptions): Observable<ApiResponse<T>> {
    const request$ = options?.shouldFail
      ? throwError(() => createMockApiError(
          options.failureMessage ?? 'Mock request failed.',
          options.failureStatus ?? 500
        ))
      : of(this.createApiResponse(data, options?.message));

    return this.runRequest(request$.pipe(delay(options?.delayMs ?? 250)), options?.trackLoading);
  }

  mockData<T>(data: T, options?: MockRequestOptions): Observable<T> {
    return this.mockResponse(data, options).pipe(
      map((response) => {
        if (response.data === null) {
          throw createMockApiError('Mock response did not contain data.', 500);
        }

        return response.data;
      })
    );
  }

  mockFailure<T>(message: string, status = 500, options?: MockRequestOptions): Observable<T> {
    return this.runRequest(
      throwError(() => createMockApiError(message, status)).pipe(delay(options?.delayMs ?? 250)),
      options?.trackLoading
    );
  }

  private createApiResponse<T>(data: T, message = 'Mock request completed successfully.'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  private runRequest<T>(request$: Observable<T>, trackLoading = true): Observable<T> {
    if (!trackLoading) {
      return request$;
    }

    return this.apiLoadingService.track(request$);
  }
}
