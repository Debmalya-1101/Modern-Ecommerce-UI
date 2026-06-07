import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { Cart } from '../models/cart.model';
import { ApiService } from './api.service';

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartApiService {
  private readonly apiService = inject(ApiService);

  getCart(): Observable<Cart> {
    return this.apiService.get<Cart>(API_ENDPOINTS.cart.root, undefined, { trackLoading: true });
  }

  addToCart(productId: number, quantity: number): Observable<Cart> {
    const request: AddToCartRequest = { productId, quantity };
    return this.apiService.post<Cart, AddToCartRequest>(API_ENDPOINTS.cart.add, request, { trackLoading: true });
  }

  updateItemQuantity(itemId: number, quantity: number): Observable<Cart> {
    const params = { quantity };
    // We do not track loading on quantity updates to support fast optimistic UI feedback.
    // The backend endpoint accepts quantity as a request parameter (query param) rather than in the request body.
    return this.apiService.put<Cart, null>(
      API_ENDPOINTS.cart.item(itemId),
      null,
      params,
      { trackLoading: false }
    );
  }

  removeItem(itemId: number): Observable<Cart> {
    return this.apiService.delete<Cart>(API_ENDPOINTS.cart.item(itemId), undefined, { trackLoading: true });
  }

  clearCart(): Observable<string> {
    return this.apiService.delete<string>(API_ENDPOINTS.cart.clear, undefined, { trackLoading: true, responseType: 'text' });
  }
}
