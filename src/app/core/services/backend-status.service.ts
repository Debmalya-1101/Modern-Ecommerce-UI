import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { PageResponse } from '../models/api.model';
import { BackendConnectionStatus } from '../models/backend-status.model';
import { ProductListItem } from '../models/product.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BackendStatusService {
  private readonly apiService = inject(ApiService);

  checkConnection(): Observable<BackendConnectionStatus> {
    return this.apiService
      .get<PageResponse<ProductListItem>>(
        API_ENDPOINTS.products.list,
        {
          page: 0,
          size: 1
        },
        {
          trackLoading: false
        }
      )
      .pipe(
        map((response) => ({
          state: 'connected',
          endpoint: API_ENDPOINTS.products.list,
          checkedAt: new Date().toISOString(),
          message: 'Backend connection verified successfully.',
          sampleProductCount: response.totalElements
        }))
      );
  }
}
