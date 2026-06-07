import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { Wishlist } from '../models/wishlist.model';
import { ApiService } from './api.service';

export interface AddToWishlistRequest {
  productId: number;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistApiService {
  private readonly apiService = inject(ApiService);

  getWishlist(): Observable<Wishlist> {
    return this.apiService.get<Wishlist>(API_ENDPOINTS.wishlist.root, undefined, { trackLoading: true });
  }

  addToWishlist(productId: number): Observable<Wishlist> {
    const request: AddToWishlistRequest = { productId };
    return this.apiService.post<Wishlist, AddToWishlistRequest>(API_ENDPOINTS.wishlist.add, request, { trackLoading: true });
  }

  toggleWishlist(productId: number): Observable<Wishlist> {
    return this.apiService.post<Wishlist, null>(API_ENDPOINTS.wishlist.toggle(productId), null, { trackLoading: false });
  }

  removeItem(itemId: number): Observable<Wishlist> {
    return this.apiService.delete<Wishlist>(API_ENDPOINTS.wishlist.item(itemId), undefined, { trackLoading: true });
  }
}
