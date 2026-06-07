export type OrderStatus = 'PLACED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface StatusCountDTO {
  status: OrderStatus;
  count: number;
}

export interface MonthlySalesDataDTO {
  month: number;
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface TopSellingProductDTO {
  productId: number;
  productName: string;
  unitsSold: number;
  totalRevenue: number;
  rating: number;
}

export interface DashboardAnalyticsDTO {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: StatusCountDTO[];
  monthlySalesGraph: MonthlySalesDataDTO[];
  topSellingProducts: TopSellingProductDTO[];
}
