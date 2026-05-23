export interface CartItem {
  itemId: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  cartTotal: number;
}
