import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule
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

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.ordersApiService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.error.set('Failed to load orders. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  getOrderStatusStep(status: string): number {
    if (!status) return 1;
    const s = status.toUpperCase();
    switch (s) {
      case 'PLACED': return 1;
      case 'SHIPPED': return 2;
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

