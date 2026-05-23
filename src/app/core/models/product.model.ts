export interface ProductListItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  active: boolean;
  brand: string;
  categoryName: string;
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
  imageUrl: string;
  rating: number;
  active: boolean;
  brand: string;
  categoryName: string;
  imageGallery: string[];
  specifications: ProductSpecification[];
}
