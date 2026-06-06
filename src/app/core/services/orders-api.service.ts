import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { CheckoutRequest, OrderResponse } from '../models/order.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersApiService {
  private readonly apiService = inject(ApiService);

  getOrders(): Observable<OrderResponse[]> {
    return this.apiService.get<OrderResponse[]>(API_ENDPOINTS.orders.root, undefined, { trackLoading: true });
  }

  getOrderDetail(orderId: number): Observable<OrderResponse> {
    return this.apiService.get<OrderResponse>(API_ENDPOINTS.orders.detail(orderId), undefined, { trackLoading: true });
  }

  checkout(request: CheckoutRequest): Observable<OrderResponse> {
    return this.apiService.post<OrderResponse, CheckoutRequest>(
      API_ENDPOINTS.orders.checkout,
      request,
      { trackLoading: true }
    );
  }
}
