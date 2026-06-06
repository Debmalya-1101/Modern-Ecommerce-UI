import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { OrdersApiService } from '../../core/services/orders-api.service';
import { OrderResponse } from '../../core/models/order.model';
import { APP_CONSTANTS } from '../../core/config/app.constants';

@Component({
  selector: 'app-order-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss']
})
export class OrderDetailPage implements OnInit {
  private readonly ordersApiService = inject(OrdersApiService);
  private readonly route = inject(ActivatedRoute);
  
  readonly currencyCode = APP_CONSTANTS.currencyCode;
  readonly order = signal<OrderResponse | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  orderId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.orderId = +idParam;
        this.loadOrderDetails();
      } else {
        this.error.set('Invalid order ID.');
        this.isLoading.set(false);
      }
    });
  }

  loadOrderDetails(): void {
    if (!this.orderId) return;

    this.isLoading.set(true);
    this.error.set(null);
    
    this.ordersApiService.getOrderDetail(this.orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading order details:', err);
        this.error.set('Failed to load order details. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }
}
