import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { PageResponse } from '../models/api.model';
import {
  ProductDetail,
  ProductDetailDTO,
  ProductListDTO,
  ProductListItem,
} from '../models/product.model';

/**
 * Query parameters for filtering the product catalog.
 * All fields are optional — omitting a field means "no filter applied".
 */
export interface ProductCatalogQuery {
  searchTerm?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  order?: string;
  page?: number;
  size?: number;
}

export interface PaginatedProducts {
  products: ProductListItem[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/**
 * ProductsApiService
 *
 * Responsible for all product-related HTTP calls to the backend.
 * Wraps raw backend DTOs into the frontend model types used by components.
 *
 * Public product endpoints (/api/products/**) require no auth token.
 * The JWT interceptor already skips these routes automatically.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  private readonly apiService = inject(ApiService);

  /**
   * Fetches a page of products from the backend based on filter criteria.
   *
   * Query params supported by the backend:
   *   search    — free-text search on name / brand / description
   *   category  — filter by exact category name
   *   brand     — filter by exact brand name
   *   minPrice  — minimum price filter
   *   maxPrice  — maximum price filter
   *   sortBy    — field to sort by (createdAt, price, rating, name)
   *   order     — sort direction (asc, desc)
   *   page      — 0-indexed page number (default: 0)
   *   size      — items per page (default: 12)
   *
   * @param query  Optional filter, sort, and pagination values
   */
  getProducts(query?: ProductCatalogQuery): Observable<PaginatedProducts> {
    // Build query params — only include non-empty values
    const params: Record<string, string | number> = {
      page: query?.page ?? 0,
      size: query?.size ?? 12,
    };

    if (query?.searchTerm?.trim()) {
      params['search'] = query.searchTerm.trim();
    }
    if (query?.category?.trim()) {
      params['category'] = query.category.trim();
    }
    if (query?.brand?.trim()) {
      params['brand'] = query.brand.trim();
    }
    if (query?.minPrice !== undefined && query?.minPrice !== null) {
      params['minPrice'] = query.minPrice;
    }
    if (query?.maxPrice !== undefined && query?.maxPrice !== null) {
      params['maxPrice'] = query.maxPrice;
    }
    if (query?.sortBy?.trim()) {
      params['sortBy'] = query.sortBy.trim();
    }
    if (query?.order?.trim()) {
      params['order'] = query.order.trim();
    }

    return this.apiService
      .get<PageResponse<ProductListDTO>>(API_ENDPOINTS.products.list, params, {
        trackLoading: true
      })
      .pipe(
        map((response) => ({
          products: response.content.map((dto) => this.mapToProductListItem(dto)),
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last
        }))
      );
  }

  /**
   * Fetches the full details of a single product by ID.
   *
   * Calls GET /api/products/{id}
   * Returns a 404 AppHttpError if the product does not exist.
   *
   * @param productId  The numeric product ID from the URL route parameter
   */
  getProductDetail(productId: number): Observable<ProductDetail> {
    return this.apiService
      .get<ProductDetailDTO>(API_ENDPOINTS.products.detail(productId), undefined, {
        trackLoading: true
      })
      .pipe(
        map((dto) => this.mapToProductDetail(dto))
      );
  }

  /**
   * Fetches home page featured products (capped to 8).
   * Calls GET /api/home/featured-products
   */
  getHomeFeaturedProducts(): Observable<ProductListItem[]> {
    return this.apiService
      .get<ProductListDTO[]>(API_ENDPOINTS.home.featuredProducts, undefined, {
        trackLoading: true
      })
      .pipe(
        map((dtos) => dtos.map((dto) => this.mapToProductListItem(dto)))
      );
  }

  /**
   * Fetches home page new arrivals (capped to 8).
   * Calls GET /api/home/new-arrivals
   */
  getHomeNewArrivals(): Observable<ProductListItem[]> {
    return this.apiService
      .get<ProductListDTO[]>(API_ENDPOINTS.home.newArrivals, undefined, {
        trackLoading: true
      })
      .pipe(
        map((dtos) => dtos.map((dto) => this.mapToProductListItem(dto)))
      );
  }

  /**
   * Fetches a list of distinct category names available in the catalog.
   *
   * Calls the dedicated /api/products/categories endpoint which returns
   * a lightweight array of strings, avoiding heavy product object downloads.
   *
   * trackLoading is false here so this background call does not trigger
   * the global loading spinner used by the product grid.
   */
  getCatalogCategories(): Observable<string[]> {
    return this.apiService.get<string[]>(
      API_ENDPOINTS.products.categories,
      undefined,
      { trackLoading: false }
    );
  }

  /**
   * Fetches a list of distinct brand names available in the catalog.
   *
   * The backend has no dedicated /brands endpoint, so we load a broad
   * sample of products and extract the unique brand names from them.
   *
   * trackLoading is false here so this background call does not trigger
   * the global loading spinner used by the product grid.
   */
  getCatalogBrands(): Observable<string[]> {
    return this.apiService.get<string[]>(
      API_ENDPOINTS.products.brands,
      undefined,
      { trackLoading: false }
    );
  }

  // ---------------------------------------------------------------------------
  // Private mapping helpers
  // These convert raw backend DTOs into the frontend model types.
  // Fields that the backend does not provide are intentionally omitted here —
  // they remain undefined in the model (all optional fields).
  // ---------------------------------------------------------------------------

  private mapToProductListItem(dto: ProductListDTO): ProductListItem {
    return {
      id: dto.id,
      name: dto.name,
      price: dto.price,
      imageUrl: dto.imageUrl,
      rating: dto.rating,
      ratingCount: dto.ratingCount,
      active: dto.active,
      brand: dto.brand,
      categoryName: dto.categoryName,
      reviewCount: dto.ratingCount,
      // Fields not provided by the backend public API are left undefined.
      // originalPrice, imageLabel, badge, shortDescription
    };
  }

  private mapToProductDetail(dto: ProductDetailDTO): ProductDetail {
    return {
      id: dto.id,
      name: dto.name,
      fullName: dto.fullName,
      description: dto.description,
      price: dto.price,
      imageUrl: dto.imageUrl,
      rating: dto.rating,
      ratingCount: dto.ratingCount,
      active: dto.active,
      brand: dto.brand,
      categoryName: dto.categoryName,
      imageGallery: dto.imageGallery,
      specifications: dto.specifications,
      reviewCount: dto.ratingCount,
      // Fields not provided by the backend public API are left undefined.
      // originalPrice, imageLabel, badge, stockStatus, stockLabel
    };
  }
}
