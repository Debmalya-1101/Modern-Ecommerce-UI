// =============================================================================
// Backend DTO interfaces
// These match exactly what the Spring Boot API returns.
// Fields here are only what the backend actually sends — nothing more.
// =============================================================================

/**
 * Shape returned by GET /api/products (inside PageResponse.content).
 * This is the lightweight version used in the product catalog list.
 */
export interface ProductListDTO {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  active: boolean;
  brand: string;
  categoryName: string;
}

/**
 * Shape returned by GET /api/products/{id}.
 * This is the full product detail including gallery and specifications.
 */
export interface ProductDetailDTO {
  id: number;
  name: string;
  fullName: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  active: boolean;
  brand: string;
  categoryName: string;
  imageGallery: string[];
  specifications: ProductSpecification[];
}

// =============================================================================
// Frontend view model interfaces
// These are used by Angular components. Some fields are optional because
// the backend public API does not return them. UI components should guard
// optional fields with @if before rendering.
// =============================================================================

/**
 * Product item used in the product catalog grid.
 * Fields marked optional are not provided by the backend public API.
 */
export interface ProductListItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  ratingCount?: number;
  active: boolean;
  brand: string;
  categoryName: string;
  originalPrice?: number | null;   // Not in backend — reserved for future discount feature
  imageLabel?: string;             // Not in backend — use product name as fallback
  reviewCount?: number;            // Not in backend public list API
  badge?: string;                  // Not in backend — reserved for future promotion feature
  shortDescription?: string;       // Not in backend public list API
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export type ProductStockStatus = 'in-stock' | 'limited' | 'out-of-stock';

/**
 * Full product detail used on the product details page.
 * Fields marked optional are not provided by the backend public API.
 */
export interface ProductDetail {
  id: number;
  name: string;
  fullName?: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  ratingCount?: number;
  active: boolean;
  brand: string;
  categoryName: string;
  imageGallery: string[];
  specifications: ProductSpecification[];
  originalPrice?: number | null;   // Not in backend — reserved for future discount feature
  imageLabel?: string;             // Not in backend — use product name as fallback in UI
  reviewCount?: number;            // Not in backend public detail API
  badge?: string;                  // Not in backend — reserved for future promotion feature
  stockStatus?: ProductStockStatus; // Not in backend public API (only in admin DTO)
  stockLabel?: string;             // Not in backend public API
}
