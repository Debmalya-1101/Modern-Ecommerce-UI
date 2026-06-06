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
   * Fetches the first page of products from the backend.
   *
   * The backend returns a PageResponse<ProductListDTO> (paginated wrapper).
   * We unwrap .content here so callers get a plain array.
   *
   * Query params supported by the backend:
   *   search    — free-text search on name / brand / description
   *   category  — filter by exact category name
   *   page      — 0-indexed page number (default: 0)
   *   size      — items per page (default: 12, we request 24)
   *
   * @param query  Optional search and category filter values
   */
  getProducts(query?: ProductCatalogQuery): Observable<ProductListItem[]> {
    // Build query params — only include non-empty values
    const params: Record<string, string | number> = {
      page: 0,
      size: 24,
    };

    if (query?.searchTerm?.trim()) {
      params['search'] = query.searchTerm.trim();
    }

    if (query?.category?.trim()) {
      params['category'] = query.category.trim();
    }

    return this.apiService
      .get<PageResponse<ProductListDTO>>(API_ENDPOINTS.products.list, params, {
        trackLoading: true
      })
      .pipe(
        // The backend wraps results in PageResponse — unwrap the content array
        map((response) => response.content.map((dto) => this.mapToProductListItem(dto)))
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
   * Fetches a list of distinct category names available in the catalog.
   *
   * The backend has no dedicated /categories endpoint, so we load a broad
   * sample of products and extract the unique category names from them.
   *
   * trackLoading is false here so this background call does not trigger
   * the global loading spinner used by the product grid.
   */
  getCatalogCategories(): Observable<string[]> {
    return this.apiService
      .get<PageResponse<ProductListDTO>>(
        API_ENDPOINTS.products.list,
        { page: 0, size: 100 },
        { trackLoading: false }
      )
      .pipe(
        map((response) => {
          // Extract category names and deduplicate
          const allCategories = response.content.map((product) => product.categoryName);
          const uniqueCategories = [...new Set(allCategories)];
          return uniqueCategories.sort((a, b) => a.localeCompare(b));
        })
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
      active: dto.active,
      brand: dto.brand,
      categoryName: dto.categoryName,
      // Fields not provided by the backend public API are left undefined.
      // originalPrice, imageLabel, reviewCount, badge, shortDescription
    };
  }

  private mapToProductDetail(dto: ProductDetailDTO): ProductDetail {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      imageUrl: dto.imageUrl,
      rating: dto.rating,
      active: dto.active,
      brand: dto.brand,
      categoryName: dto.categoryName,
      imageGallery: dto.imageGallery,
      specifications: dto.specifications,
      // Fields not provided by the backend public API are left undefined.
      // originalPrice, imageLabel, reviewCount, badge, stockStatus, stockLabel
    };
  }
}
