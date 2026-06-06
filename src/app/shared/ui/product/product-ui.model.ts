export interface ProductCardViewModel {
  id: number;
  name: string;
  brand: string;
  category: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviewCount: number;
  badge?: string;
  imageUrl: string;   // Real image URL from the backend
  imageLabel: string; // Alt text / fallback label
}

