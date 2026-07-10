import { OrderStatus } from './order.model';

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
  totalEmailsSent: number;
  totalEmailsFailed: number;
  ordersByStatus: StatusCountDTO[];
  monthlySalesGraph: MonthlySalesDataDTO[];
  topSellingProducts: TopSellingProductDTO[];
}
