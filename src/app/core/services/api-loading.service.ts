import { Injectable, computed, signal } from '@angular/core';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiLoadingService {
  private readonly activeRequests = signal(0);

  readonly activeRequestCount = computed(() => this.activeRequests());
  readonly isLoading = computed(() => this.activeRequests() > 0);

  track<T>(request$: Observable<T>): Observable<T> {
    this.activeRequests.update((count) => count + 1);

    return request$.pipe(
      finalize(() => {
        this.activeRequests.update((count) => Math.max(0, count - 1));
      })
    );
  }
}
