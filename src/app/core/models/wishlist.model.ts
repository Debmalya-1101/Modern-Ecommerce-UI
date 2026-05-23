export interface WishlistItem {
  itemId: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  rating: number;
}

export interface Wishlist {
  items: WishlistItem[];
}
