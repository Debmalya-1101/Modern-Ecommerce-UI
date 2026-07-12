import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { forkJoin, catchError, of, finalize, tap } from 'rxjs';

import { AdminAnalyticsService } from '../../../core/services/admin-analytics.service';
import { AdminOrdersService } from '../../../core/services/admin-orders.service';
import { AdminProductsService } from '../../../core/services/admin-products.service';
import { AdminCategoriesService } from '../../../core/services/admin-categories.service';
import { AdminInventoryService } from '../../../core/services/admin-inventory.service';

import { DashboardAnalyticsDTO } from '../../../core/models/admin-analytics.model';
import { AdminOrder } from '../../../core/models/admin-order.model';
import { AdminProductDTO } from '../../../core/models/admin-product.model';
import { InventoryAnalyticsDashboardDTO } from '../../../core/models/admin-inventory.model';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CurrencyPipe,
    DecimalPipe,
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    StatusFormatPipe
  ],
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.scss'
})
export class AdminDashboardPage implements OnInit {
  private analyticsService = inject(AdminAnalyticsService);
  private ordersService = inject(AdminOrdersService);
  private productsService = inject(AdminProductsService);
  private categoriesService = inject(AdminCategoriesService);
  private inventoryService = inject(AdminInventoryService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  hasError = false;

  analyticsData: DashboardAnalyticsDTO | null = null;
  inventoryData: InventoryAnalyticsDashboardDTO | null = null;
  recentOrders: AdminOrder[] = [];
  lowStockProducts: AdminProductDTO[] = [];
  totalCategories = 0;

  averageOrderValue = 0;
  placedCount = 0;
  shippedCount = 0;
  deliveredCount = 0;

  displayedOrderColumns: string[] = ['orderId', 'createdAt', 'total', 'status', 'actions'];
  displayedStockColumns: string[] = ['name', 'stock', 'status', 'actions'];
  displayedTopProductsColumns: string[] = ['name', 'unitsSold', 'totalRevenue', 'rating'];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.hasError = false;
    this.cdr.markForCheck();

    try {
      forkJoin({
        analytics: this.analyticsService.getDashboardAnalytics().pipe(
          tap({
            error: (err) => console.error('AdminDashboardPage: Analytics API error:', err)
          }),
          catchError((err) => {
            console.warn('AdminDashboardPage: Catching Analytics API error, returning null:', err);
            return of(null);
          })
        ),
        orders: this.ordersService.getOrders({ page: 0, size: 5, status: 'CONFIRMED' }).pipe(
          tap({
            error: (err) => console.error('AdminDashboardPage: Orders API error:', err)
          }),
          catchError((err) => {
            console.warn('AdminDashboardPage: Catching Orders API error, returning null:', err);
            return of(null);
          })
        ),
        products: this.productsService.getProducts(0, 5, undefined, 'stock', 'asc').pipe(
          tap({
            error: (err) => console.error('AdminDashboardPage: Products API error:', err)
          }),
          catchError((err) => {
            console.warn('AdminDashboardPage: Catching Products API error, returning null:', err);
            return of(null);
          })
        ),
        categories: this.categoriesService.getCategories().pipe(
          tap({
            error: (err) => console.error('AdminDashboardPage: Categories API error:', err)
          }),
          catchError((err) => {
            console.warn('AdminDashboardPage: Catching Categories API error, returning empty array:', err);
            return of([]);
          })
        ),
        inventory: this.inventoryService.getInventoryAnalytics().pipe(
          tap({
            error: (err) => console.error('AdminDashboardPage: Inventory API error:', err)
          }),
          catchError((err) => {
            console.warn('AdminDashboardPage: Catching Inventory API error, returning null:', err);
            return of(null);
          })
        )
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (results) => {
          try {
            if (!results.analytics) {
              console.warn('AdminDashboardPage: Analytics data is empty, setting error state');
              this.hasError = true;
              this.cdr.markForCheck();
              return;
            }

            this.analyticsData = {
              ...results.analytics,
              ordersByStatus: results.analytics.ordersByStatus || [],
              monthlySalesGraph: results.analytics.monthlySalesGraph || [],
              topSellingProducts: (results.analytics.topSellingProducts || []).slice(0, 4)
            };
            this.recentOrders = results.orders?.content || [];
            this.lowStockProducts = results.products?.content || [];
            this.totalCategories = results.categories?.length || 0;
            this.inventoryData = results.inventory;

            // Compute metrics
            if (this.analyticsData.totalOrders > 0) {
              this.averageOrderValue = (this.analyticsData.totalRevenue || 0) / this.analyticsData.totalOrders;
            } else {
              this.averageOrderValue = 0;
            }

            // Reset status counters
            this.placedCount = 0;
            this.shippedCount = 0;
            this.deliveredCount = 0;

            this.analyticsData.ordersByStatus.forEach(statusCount => {
              if (statusCount.status === 'CONFIRMED' || statusCount.status === 'PENDING_PAYMENT') this.placedCount += statusCount.count;
              else if (statusCount.status === 'SHIPPED') this.shippedCount = statusCount.count;
              else if (statusCount.status === 'DELIVERED') this.deliveredCount = statusCount.count;
            });
            
            this.cdr.markForCheck();
          } catch (innerError) {
            console.error('AdminDashboardPage: Exception while processing successful results:', innerError);
            this.hasError = true;
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          console.error('AdminDashboardPage: forkJoin subscription error:', err);
          this.hasError = true;
          this.cdr.markForCheck();
        },
        complete: () => {
        }
      });
    } catch (outerError) {
      console.error('AdminDashboardPage: Exception during forkJoin setup:', outerError);
      this.hasError = true;
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  retry(): void {
    this.loadDashboardData();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'CONFIRMED':
      case 'PENDING_PAYMENT': return 'primary';
      case 'SHIPPED': return 'accent';
      case 'DELIVERED': return 'primary';
      case 'CANCELLED': return 'warn';
      default: return '';
    }
  }

  getStockColor(stock: number): string {
    if (stock === 0) return 'warn';
    if (stock <= 10) return 'accent';
    return 'primary';
  }
}
