export type OrderStatus = 'PLACED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderResponse {
  orderId: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export interface CheckoutRequest {
  name: string;
  phoneNo: string;
  email: string;
  address: string;
}
