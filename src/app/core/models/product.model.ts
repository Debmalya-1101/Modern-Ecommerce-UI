export interface ProductListItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number | null;
  imageUrl: string;
  imageLabel: string;
  rating: number;
  reviewCount: number;
  active: boolean;
  brand: string;
  categoryName: string;
  badge?: string;
  shortDescription?: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  imageUrl: string;
  imageLabel: string;
  rating: number;
  reviewCount: number;
  active: boolean;
  brand: string;
  categoryName: string;
  badge?: string;
  imageGallery: string[];
  specifications: ProductSpecification[];
}
