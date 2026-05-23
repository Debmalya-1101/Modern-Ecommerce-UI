import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { Cart } from '../models/cart.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CartApiService {
  private readonly apiService = inject(ApiService);

  getCart(): Observable<Cart> {
    return this.apiService
      .mockResponse<Cart>(this.createMockCart(), {
        delayMs: 250,
        message: `Mock GET ${API_ENDPOINTS.cart.root}`,
        trackLoading: true
      })
      .pipe(map((response) => response.data ?? this.createMockCart()));
  }

  clearCart(): Observable<string> {
    return this.apiService
      .mockResponse<string>('Mock cart cleared.', {
        delayMs: 200,
        message: `Mock DELETE ${API_ENDPOINTS.cart.clear}`,
        trackLoading: true
      })
      .pipe(map((response) => response.data ?? 'Mock cart cleared.'));
  }

  private createMockCart(): Cart {
    return {
      items: [
        {
          itemId: 1,
          productId: 101,
          productName: 'Everyday Carry Backpack',
          imageUrl: '',
          price: 3299,
          quantity: 1,
          total: 3299
        }
      ],
      cartTotal: 3299
    };
  }
}
