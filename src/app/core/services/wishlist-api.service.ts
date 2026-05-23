import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { Wishlist } from '../models/wishlist.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistApiService {
  private readonly apiService = inject(ApiService);

  getWishlist(): Observable<Wishlist> {
    return this.apiService
      .mockResponse<Wishlist>(this.createMockWishlist(), {
        delayMs: 250,
        message: `Mock GET ${API_ENDPOINTS.wishlist.root}`,
        trackLoading: true
      })
      .pipe(map((response) => response.data ?? this.createMockWishlist()));
  }

  private createMockWishlist(): Wishlist {
    return {
      items: [
        {
          itemId: 10,
          productId: 102,
          productName: 'Studio Wireless Headphones',
          imageUrl: '',
          price: 8999,
          rating: 4.4
        }
      ]
    };
  }
}
