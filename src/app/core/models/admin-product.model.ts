export interface ProductAttributeDTO {
  keyId: number;
  value: string;
}

export interface AdminProductDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  brand: string;
  categoryId: number;
  categoryName: string;
  rating: number;
  imageUrl: string;
  imageUrls: string[];
  attributes: ProductAttributeDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductPaginationResponseDTO {
  content: AdminProductDTO[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CreateProductDTO {
  name: string;
  price: number;
  description: string;
  brand: string;
  stock: number;
  categoryId: number;
  imageUrl: string;
  active: boolean;
  attributes: ProductAttributeDTO[];
  additionalImageUrls: string[];
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface AmazonScrapeRequest {
  asins: string[];
  categoryName: string;
  simulatedReviews?: number;
  simulatedOrders?: number;
}

export interface FlipkartScrapeRequest {
  fsns: string[];
  categoryName: string;
  simulatedReviews?: number;
  simulatedOrders?: number;
}

export interface AmazonScrapeResultDTO {
  status: string;
  asin: string;
  message: string;
  productId?: number;
  productName?: string;
  fullProductName?: string;
  priceInr?: number;
  category?: string;
  mainImageUrl?: string;
  imagesInserted?: number;
  attributesInserted?: number;
  reviewsSimulated?: number;
  ordersSimulated?: number;
  galleryImageUrls?: string[];
}

export interface FlipkartScrapeResultDTO {
  status: string;
  fsn: string;
  message: string;
  productId?: number;
  productName?: string;
  fullProductName?: string;
  priceInr?: number;
  category?: string;
  mainImageUrl?: string;
  imagesInserted?: number;
  attributesInserted?: number;
  reviewsSimulated?: number;
  ordersSimulated?: number;
  galleryImageUrls?: string[];
}
