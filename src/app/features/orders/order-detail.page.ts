import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { OrdersApiService } from '../../core/services/orders-api.service';
import { OrderDetail } from '../../core/models/order.model';
import { APP_CONSTANTS } from '../../core/config/app.constants';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryFeedbackDialogComponent } from './components/delivery-feedback-dialog/delivery-feedback-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeliveryFeedbackService } from '../../core/services/delivery-feedback.service';
import { DeliveryFeedbackStatusDTO } from '../../core/models/delivery-feedback.model';

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
  private readonly feedbackService = inject(DeliveryFeedbackService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  
  readonly currencyCode = APP_CONSTANTS.currencyCode;
  readonly order = signal<OrderDetail | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  
  readonly feedbackStatus = signal<DeliveryFeedbackStatusDTO | null>(null);
  readonly isLoadingFeedback = signal<boolean>(false);
  
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
        
        if (order.orderStatus === 'DELIVERED') {
          this.loadFeedbackStatus(order.orderId);
        }
      },
      error: (err: any) => {
        console.error('Error loading order details:', err);
        this.error.set('Failed to load order details. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  loadFeedbackStatus(orderId: number): void {
    this.isLoadingFeedback.set(true);
    this.feedbackService.checkFeedbackStatus(orderId).subscribe({
      next: (status) => {
        this.feedbackStatus.set(status);
        this.isLoadingFeedback.set(false);
      },
      error: (err: any) => {
        console.error('Error loading feedback status:', err);
        this.isLoadingFeedback.set(false);
      }
    });
  }

  getPaymentStatusLabel(status: string): string {
    if (!status) return 'Pending';
    const s = status.toUpperCase();
    if (s === 'COMPLETED' || s === 'SUCCESS') return 'Paid';
    if (s === 'FAILED') return 'Failed';
    return 'Pending';
  }

  getPaymentStatusClass(status: string): string {
    if (!status) return 'initiated';
    const s = status.toUpperCase();
    if (s === 'COMPLETED' || s === 'SUCCESS') return 'completed';
    if (s === 'FAILED') return 'failed';
    return 'initiated';
  }

  getPaymentStatusIcon(status: string): string {
    if (!status) return 'pending';
    const s = status.toUpperCase();
    if (s === 'COMPLETED' || s === 'SUCCESS') return 'check_circle';
    if (s === 'FAILED') return 'error';
    return 'pending';
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

  openDeliveryFeedbackDialog(): void {
    if (!this.orderId) return;

    const dialogRef = this.dialog.open(DeliveryFeedbackDialogComponent, {
      width: '400px',
      data: { orderId: this.orderId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Thank you for your feedback!', 'Close', { duration: 3000 });
        this.loadFeedbackStatus(this.orderId!);
      }
    });
  }
}

