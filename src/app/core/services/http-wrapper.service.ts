import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

import { APP_CONSTANTS } from '../config/app.constants';
import { environment } from '../../../environments/environment';
import { ApiQueryParams, ApiRequestOptions } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class HttpWrapperService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly requestTimeoutMs = APP_CONSTANTS.requestTimeoutMs;

  get<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    return this.http
      .get<T>(this.buildUrl(path), {
        params: this.createParams(options?.params)
      })
      .pipe(timeout(this.requestTimeoutMs));
  }

  post<TResponse, TBody>(path: string, body: TBody, options?: ApiRequestOptions): Observable<TResponse> {
    return this.http
      .post<TResponse>(this.buildUrl(path), body, {
        params: this.createParams(options?.params)
      })
      .pipe(timeout(this.requestTimeoutMs));
  }

  put<TResponse, TBody>(path: string, body: TBody, options?: ApiRequestOptions): Observable<TResponse> {
    return this.http
      .put<TResponse>(this.buildUrl(path), body, {
        params: this.createParams(options?.params)
      })
      .pipe(timeout(this.requestTimeoutMs));
  }

  patch<TResponse, TBody>(path: string, body: TBody, options?: ApiRequestOptions): Observable<TResponse> {
    return this.http
      .patch<TResponse>(this.buildUrl(path), body, {
        params: this.createParams(options?.params)
      })
      .pipe(timeout(this.requestTimeoutMs));
  }

  delete<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    return this.http
      .delete<T>(this.buildUrl(path), {
        params: this.createParams(options?.params)
      })
      .pipe(timeout(this.requestTimeoutMs));
  }

  private buildUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }

    return `${this.apiBaseUrl}${path}`;
  }

  private createParams(params?: ApiQueryParams): HttpParams | undefined {
    if (!params) {
      return undefined;
    }

    let httpParams = new HttpParams();

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') {
        continue;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          httpParams = httpParams.append(key, String(item));
        });
        continue;
      }

      httpParams = httpParams.set(key, String(value));
    }

    return httpParams;
  }
}
