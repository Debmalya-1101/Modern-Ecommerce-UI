import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { ApiService } from './api.service';
import { ApiQueryParams, PageResponse } from '../models/api.model';
import { ProductDetail, ProductListItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  private readonly apiService = inject(ApiService);

  getProducts(params?: ApiQueryParams): Observable<PageResponse<ProductListItem>> {
    return this.apiService
      .mockResponse<PageResponse<ProductListItem>>(this.createMockProductPage(params), {
        delayMs: 300,
        message: `Mock GET ${API_ENDPOINTS.products.list}`,
        trackLoading: true
      })
      .pipe(map((response) => response.data ?? this.createEmptyProductPage(params)));
  }

  getProductDetail(productId: number): Observable<ProductDetail> {
    return this.apiService
      .mockResponse<ProductDetail>(this.createMockProductDetail(productId), {
        delayMs: 250,
        message: `Mock GET ${API_ENDPOINTS.products.detail(productId)}`,
        trackLoading: true
      })
      .pipe(map((response) => response.data ?? this.createMockProductDetail(productId)));
  }

  private createMockProductPage(params?: ApiQueryParams): PageResponse<ProductListItem> {
    const products: ProductListItem[] = [
      {
        id: 101,
        name: 'Everyday Carry Backpack',
        price: 3299,
        imageUrl: '',
        rating: 4.6,
        active: true,
        brand: 'Northline',
        categoryName: 'Accessories'
      },
      {
        id: 102,
        name: 'Studio Wireless Headphones',
        price: 8999,
        imageUrl: '',
        rating: 4.4,
        active: true,
        brand: 'SoundForm',
        categoryName: 'Electronics'
      },
      {
        id: 103,
        name: 'Minimal Desk Lamp',
        price: 2199,
        imageUrl: '',
        rating: 4.3,
        active: true,
        brand: 'Luma Home',
        categoryName: 'Home'
      }
    ];

    return {
      content: products,
      pageNumber: Number(params?.['page'] ?? 0),
      pageSize: Number(params?.['size'] ?? products.length),
      totalElements: products.length,
      totalPages: 1,
      last: true
    };
  }

  private createEmptyProductPage(params?: ApiQueryParams): PageResponse<ProductListItem> {
    return {
      content: [],
      pageNumber: Number(params?.['page'] ?? 0),
      pageSize: Number(params?.['size'] ?? 12),
      totalElements: 0,
      totalPages: 0,
      last: true
    };
  }

  private createMockProductDetail(productId: number): ProductDetail {
    return {
      id: productId,
      name: 'Mock Product Detail',
      description: 'This is a placeholder product detail response for API structure work.',
      price: 4999,
      imageUrl: '',
      rating: 4.5,
      active: true,
      brand: 'Modern Commerce',
      categoryName: 'Placeholder',
      imageGallery: [],
      specifications: [
        {
          key: 'Purpose',
          value: 'Reusable API placeholder'
        }
      ]
    };
  }
}
