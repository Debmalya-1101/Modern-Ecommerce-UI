import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { DashboardAnalyticsDTO } from '../models/admin-analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AdminAnalyticsService {
  private readonly apiService = inject(ApiService);

  getDashboardAnalytics(): Observable<DashboardAnalyticsDTO> {
    return this.apiService.get<DashboardAnalyticsDTO>(
      API_ENDPOINTS.admin.analyticsDashboard,
      undefined,
      { trackLoading: true }
    ).pipe(
      catchError((error) => {
        // Log error and fallback to mock data
        console.warn('Backend unavailable, falling back to mock analytics data.', error);
        return of(this.getMockAnalyticsData());
      })
    );
  }

  private getMockAnalyticsData(): DashboardAnalyticsDTO {
    return {
      totalUsers: 12450,
      totalOrders: 4560,
      totalRevenue: 284500.50,
      ordersByStatus: [
        { status: 'PLACED', count: 120 },
        { status: 'SHIPPED', count: 450 },
        { status: 'DELIVERED', count: 3800 },
        { status: 'CANCELLED', count: 190 }
      ],
      monthlySalesGraph: [
        { month: 1, totalSales: 22000, totalOrders: 350, totalRevenue: 22000 },
        { month: 2, totalSales: 24000, totalOrders: 380, totalRevenue: 24000 },
        { month: 3, totalSales: 22500, totalOrders: 360, totalRevenue: 22500 },
        { month: 4, totalSales: 26000, totalOrders: 410, totalRevenue: 26000 },
        { month: 5, totalSales: 29000, totalOrders: 460, totalRevenue: 29000 },
        { month: 6, totalSales: 50000.50, totalOrders: 820, totalRevenue: 50000.50 },
        { month: 7, totalSales: 13500, totalOrders: 220, totalRevenue: 13500 },
        { month: 8, totalSales: 15500, totalOrders: 250, totalRevenue: 15500 },
        { month: 9, totalSales: 17000, totalOrders: 270, totalRevenue: 17000 },
        { month: 10, totalSales: 18500, totalOrders: 300, totalRevenue: 18500 },
        { month: 11, totalSales: 20000, totalOrders: 320, totalRevenue: 20000 },
        { month: 12, totalSales: 26500, totalOrders: 420, totalRevenue: 26500 }
      ],
      topSellingProducts: [
        {
          productId: 101,
          productName: 'Premium Wireless Headphones',
          unitsSold: 450,
          totalRevenue: 44550,
          rating: 4.8
        },
        {
          productId: 102,
          productName: 'Smart Watch Series 8',
          unitsSold: 320,
          totalRevenue: 95680,
          rating: 4.7
        },
        {
          productId: 103,
          productName: 'Ergonomic Office Chair',
          unitsSold: 280,
          totalRevenue: 55720,
          rating: 4.5
        },
        {
          productId: 104,
          productName: 'Mechanical Gaming Keyboard',
          unitsSold: 210,
          totalRevenue: 27090,
          rating: 4.9
        },
        {
          productId: 105,
          productName: '4K Ultra HD Monitor',
          unitsSold: 180,
          totalRevenue: 62820,
          rating: 4.6
        }
      ]
    };
  }
}
