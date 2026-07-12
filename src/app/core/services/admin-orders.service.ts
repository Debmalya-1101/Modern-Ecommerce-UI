import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { AdminOrder, AdminOrderFilters } from '../models/admin-order.model';
import { PageResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
  private apiService = inject(ApiService);

  getOrders(filters?: AdminOrderFilters): Observable<PageResponse<AdminOrder>> {
    let params: any = {};
    if (filters) {
      if (filters.status) params.status = filters.status;
      if (filters.page !== undefined) params.page = filters.page.toString();
      if (filters.size !== undefined) params.size = filters.size.toString();
    }

    return this.apiService.get<PageResponse<AdminOrder>>(API_ENDPOINTS.admin.orders, params);
  }

  getOrderDetails(id: number): Observable<AdminOrder> {
    return this.apiService.get<AdminOrder>(API_ENDPOINTS.admin.orderDetail(id));
  }

  cancelOrder(id: number, reason: string): Observable<any> {
    return this.apiService.post<any, { reason: string }>(`${API_ENDPOINTS.admin.orders}/${id}/cancel`, { reason });
  }
}
