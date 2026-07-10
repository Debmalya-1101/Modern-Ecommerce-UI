import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { OrdersApiService } from '../../core/services/orders-api.service';
import { OrderResponse } from '../../core/models/order.model';
import { APP_CONSTANTS } from '../../core/config/app.constants';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss']
})
export class OrdersPage implements OnInit {
  private readonly ordersApiService = inject(OrdersApiService);
  
  readonly currencyCode = APP_CONSTANTS.currencyCode;
  readonly orders = signal<OrderResponse[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  readonly totalElements = signal<number>(0);
  readonly pageSize = signal<number>(10);
  readonly pageIndex = signal<number>(0);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.ordersApiService.getOrders(this.pageIndex(), this.pageSize()).subscribe({
      next: (response) => {
        this.orders.set(response.content);
        this.totalElements.set(response.totalElements);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error.set('Failed to load orders. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadOrders();
  }

  getOrderStatusStep(status: string): number {
    if (!status) return 1;
    const s = status.toUpperCase();
    switch (s) {
      case 'PENDING_PAYMENT':
      case 'PAYMENT_FAILED':
      case 'CONFIRMED': return 1;
      case 'PROCESSING':
      case 'SHIPPED': return 2;
      case 'OUT_FOR_DELIVERY':
      case 'DELIVERED': return 3;
      default: return 1;
    }
  }

  getProductNamesSummary(order: OrderResponse): string {
    if (!order || !order.items || order.items.length === 0) return 'No items';
    const names = order.items.map(item => item.productName);
    const joined = names.join(', ');
    const maxLength = 65;
    if (joined.length <= maxLength) {
      return joined;
    }
    return joined.substring(0, maxLength) + '...';
  }
}

