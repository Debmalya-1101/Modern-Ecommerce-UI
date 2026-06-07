import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PaymentApiService } from '../../core/services/payment-api.service';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
  selector: 'app-payment-failure-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './payment-failure.page.html',
  styleUrls: ['./payment-failure.page.scss']
})
export class PaymentFailurePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paymentApiService = inject(PaymentApiService);
  private readonly snackbar = inject(SnackbarService);

  readonly isRetrying = signal<boolean>(false);
  orderId: number | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idParam = params['orderId'];
      if (idParam) {
        this.orderId = +idParam;
      }
    });
  }

  onRetry(): void {
    if (!this.orderId) {
      this.router.navigate(['/']);
      return;
    }

    this.isRetrying.set(true);
    
    this.paymentApiService.retryPayment({ orderId: this.orderId }).subscribe({
      next: (sessionData) => {
        this.isRetrying.set(false);
        // Retry generated a new session, let's route back to processing page
        this.router.navigate(['/payment', this.orderId]);
      },
      error: (err) => {
        this.isRetrying.set(false);
        this.snackbar.error('Could not initiate retry. Please try again later.');
      }
    });
  }
}
