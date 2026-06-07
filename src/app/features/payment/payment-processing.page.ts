import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OrdersApiService } from '../../core/services/orders-api.service';
import { PaymentApiService } from '../../core/services/payment-api.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { APP_CONSTANTS } from '../../core/config/app.constants';
import { OrderResponse } from '../../core/models/order.model';
import { PaymentInitiateResponse } from '../../core/models/payment.model';

@Component({
  selector: 'app-payment-processing-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './payment-processing.page.html',
  styleUrls: ['./payment-processing.page.scss']
})
export class PaymentProcessingPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly ordersApiService = inject(OrdersApiService);
  private readonly paymentApiService = inject(PaymentApiService);
  private readonly snackbar = inject(SnackbarService);

  readonly currencyCode = APP_CONSTANTS.currencyCode;

  // State Signals
  readonly isLoading = signal<boolean>(true);
  readonly isProcessing = signal<boolean>(false);
  readonly cardFlipped = signal<boolean>(false);
  
  readonly order = signal<OrderResponse | null>(null);
  readonly session = signal<PaymentInitiateResponse | null>(null);

  orderId: number | null = null;
  
  // UI Forms
  paymentForm: FormGroup = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
    cardHolderName: ['', [Validators.required, Validators.minLength(3)]],
    expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\\/?([0-9]{2})$')]],
    cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
    simulateFailure: [false] // For developer testing
  });

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
        
        if (order.status !== 'PLACED') {
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

  onPay(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const currentSession = this.session();
    if (!currentSession || !this.orderId) {
      this.snackbar.error('Payment session invalid. Please refresh.');
      return;
    }

    this.isProcessing.set(true);

    // Developer setting to force failure
    const isSimulatingFailure = this.paymentForm.get('simulateFailure')?.value;
    const isSpecialCvv = this.paymentForm.get('cvv')?.value === '000';
    
    const isSuccess = !(isSimulatingFailure || isSpecialCvv);

    const confirmRequest = {
      orderId: this.orderId,
      paymentToken: currentSession.paymentToken,
      paymentReferenceId: currentSession.paymentReferenceId,
      success: isSuccess
    };

    this.paymentApiService.confirmPayment(confirmRequest).subscribe({
      next: (message) => {
        // Backend returns success message or error message
        this.isProcessing.set(false);
        if (isSuccess) {
          // Route to success page passing transaction info via router state
          this.router.navigate(['/payment/success'], {
            state: {
              orderId: this.orderId,
              amount: currentSession.amount,
              referenceId: currentSession.paymentReferenceId
            }
          });
        } else {
          // Route to failure page
          this.router.navigate(['/payment/failure'], { queryParams: { orderId: this.orderId } });
        }
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.router.navigate(['/payment/failure'], { queryParams: { orderId: this.orderId } });
      }
    });
  }

  onFocusCvv(): void {
    this.cardFlipped.set(true);
  }

  onBlurCvv(): void {
    this.cardFlipped.set(false);
  }
}
