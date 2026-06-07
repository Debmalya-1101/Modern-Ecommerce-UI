export interface AdminOrderItem {
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface AdminOrder {
  orderId: number;
  userName: string;
  email: string;
  address: string;
  phoneNo: string | number;
  total: number;
  status: 'PLACED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  items: AdminOrderItem[];
}

export interface AdminOrderFilters {
  status?: string;
  page?: number;
  size?: number;
}

