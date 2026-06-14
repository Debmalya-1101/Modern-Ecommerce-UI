export type OrderStatus = 'PLACED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'INITIATED' | 'COMPLETED' | 'FAILED';

export interface OrderItem {
  productId?: number;
  productName: string;
  productImageUrl?: string;
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

export interface OrderDetailItem {
  productId: number;
  productName: string;
  productImageUrl: string;
  categoryName: string | null;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface OrderDetail {
  orderId: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  recipientName: string;
  email: string;
  phoneNo: number | string;
  address: string;
  items: OrderDetailItem[];
  totalItems: number;
  grandTotal: number;
}

export interface CheckoutRequest {
  name: string;
  phoneNo: string | number;
  email: string;
  address: string;
  addressId?: number;
}
