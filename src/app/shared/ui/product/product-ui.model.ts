export interface ProductCardViewModel {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviewCount: number;
  badge?: string;
  imageLabel: string;
}
