import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OrdersApiService } from '../../core/services/orders-api.service';
import { PaymentApiService } from '../../core/services/payment-api.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { APP_CONSTANTS } from '../../core/config/app.constants';
import { OrderDetail } from '../../core/models/order.model';
import { PaymentInitiateResponse, PaymentConfirmRequest } from '../../core/models/payment.model';
import { RazorpayService } from '../../core/services/razorpay.service';

@Component({
  selector: 'app-payment-processing-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './payment-processing.page.html',
  styleUrls: ['./payment-processing.page.scss']
})
export class PaymentProcessingPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ordersApiService = inject(OrdersApiService);
  private readonly paymentApiService = inject(PaymentApiService);
  private readonly snackbar = inject(SnackbarService);
  private readonly razorpayService = inject(RazorpayService);

  readonly currencyCode = APP_CONSTANTS.currencyCode;

  // State Signals
  readonly isLoading = signal<boolean>(true);
  readonly isProcessing = signal<boolean>(false);
  
  readonly order = signal<OrderDetail | null>(null);
  readonly session = signal<PaymentInitiateResponse | null>(null);

  orderId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('orderId');
      if (idParam) {
        this.orderId = +idParam;
        this.initializePaymentFlow(this.orderId);
      } else {
        this.snackbar.error('Invalid order ID.');
        this.router.navigate(['/']);
      }
    });
  }

  private initializePaymentFlow(orderId: number): void {
    this.isLoading.set(true);

    // 1. Verify the order exists and check its status to prevent double-payment
    this.ordersApiService.getOrderDetail(orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        
        if (order.orderStatus !== 'PLACED') {
          // If already shipped/delivered or cancelled, payment shouldn't be processed here
          this.snackbar.info('This order has already been processed.');
          this.router.navigate(['/orders', orderId]);
          return;
        }

        // 2. Initiate Payment Session
        this.paymentApiService.initiatePayment(orderId).subscribe({
          next: (sessionData) => {
            this.session.set(sessionData);
            this.isLoading.set(false);
            
            // Optionally, we could auto-open the Razorpay modal here
            // this.onPay();
          },
          error: (err) => {
            this.isLoading.set(false);
            // Even if initiate fails (e.g. timeout), route to failure so they can retry
            this.router.navigate(['/payment/failure'], { queryParams: { orderId } });
          }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackbar.error('Could not load order details.');
      }
    });
  }

  async onPay(): Promise<void> {
    const currentSession = this.session();
    const currentOrder = this.order();

    if (!currentSession || !this.orderId || !currentOrder) {
      this.snackbar.error('Payment session invalid. Please refresh.');
      return;
    }

    this.isProcessing.set(true);

    try {
      const response = await this.razorpayService.openCheckout({
        amount: currentSession.amount,
        currency: currentSession.currency,
        orderId: currentSession.paymentToken, // Backend sets Razorpay order ID in paymentToken
        name: currentOrder.recipientName,
        email: currentOrder.email,
        phone: currentOrder.phoneNo?.toString()
      });

      // Verification Step
      const confirmRequest: PaymentConfirmRequest = {
        orderId: this.orderId,
        paymentToken: currentSession.paymentToken,
        paymentReferenceId: currentSession.paymentReferenceId,
        success: true,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature
      };

      this.paymentApiService.confirmPayment(confirmRequest).subscribe({
        next: () => {
          this.isProcessing.set(false);
          this.router.navigate(['/payment/success'], {
            state: {
              orderId: this.orderId,
              amount: currentSession.amount,
              referenceId: currentSession.paymentReferenceId
            }
          });
        },
        error: () => {
          this.isProcessing.set(false);
          this.router.navigate(['/payment/failure'], { queryParams: { orderId: this.orderId } });
        }
      });
    } catch (error) {
      this.isProcessing.set(false);
      // User closed the modal or payment failed inside Razorpay
      if (typeof error === 'string' && error.includes('closed')) {
        // Modal was just closed by user, don't fail the order just yet.
        // Navigate to the payment pending page.
        this.router.navigate(['/payment/pending'], {
          queryParams: { orderId: this.orderId },
          state: {
            orderId: this.orderId,
            amount: currentSession?.amount
          }
        });
      } else {
        this.snackbar.error(typeof error === 'string' ? error : 'Payment failed.');
        this.router.navigate(['/payment/failure'], { queryParams: { orderId: this.orderId } });
      }
    }
  }
}
