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
    return this.apiService
      .mockResponse<OrderResponse[]>(this.createMockOrders(), {
        delayMs: 300,
        message: `Mock GET ${API_ENDPOINTS.orders.root}`,
        trackLoading: true
      })
      .pipe(map((response) => response.data ?? []));
  }

  getOrderDetail(orderId: number): Observable<OrderResponse> {
    return this.apiService
      .mockResponse<OrderResponse>(this.createMockOrder(orderId), {
        delayMs: 250,
        message: `Mock GET ${API_ENDPOINTS.orders.detail(orderId)}`,
        trackLoading: true
      })
      .pipe(map((response) => response.data ?? this.createMockOrder(orderId)));
  }

  checkout(request: CheckoutRequest): Observable<OrderResponse> {
    return this.apiService.post<OrderResponse, CheckoutRequest>(
      API_ENDPOINTS.orders.checkout,
      request,
      { trackLoading: true }
    );
  }

  private createMockOrders(): OrderResponse[] {
    return [this.createMockOrder(5001)];
  }

  private createMockOrder(orderId: number): OrderResponse {
    return {
      orderId,
      total: 3299,
      status: 'PLACED',
      createdAt: new Date().toISOString(),
      items: [
        {
          productName: 'Everyday Carry Backpack',
          price: 3299,
          quantity: 1,
          total: 3299
        }
      ]
    };
  }
}
