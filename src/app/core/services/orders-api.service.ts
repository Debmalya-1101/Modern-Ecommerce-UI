import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { OrderDetail, CheckoutRequest, OrderResponse } from '../models/order.model';
import { ApiService } from './api.service';
import { PageResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersApiService {
  private readonly apiService = inject(ApiService);

  getOrders(page: number = 0, size: number = 10): Observable<PageResponse<OrderResponse>> {
    return this.apiService.get<PageResponse<OrderResponse>>(`${API_ENDPOINTS.orders.root}?page=${page}&size=${size}`, undefined, { trackLoading: true });
  }

  getOrderDetail(orderId: number): Observable<OrderDetail> {
    return this.apiService.get<OrderDetail>(API_ENDPOINTS.orders.detail(orderId), undefined, { trackLoading: true });
  }

  checkout(request: CheckoutRequest): Observable<OrderResponse> {
    return this.apiService.post<OrderResponse, CheckoutRequest>(
      API_ENDPOINTS.orders.checkout,
      request,
      { trackLoading: true }
    );
  }
}
