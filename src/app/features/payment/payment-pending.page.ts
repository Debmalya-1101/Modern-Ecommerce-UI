import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { APP_CONSTANTS } from '../../core/config/app.constants';

@Component({
  selector: 'app-payment-pending-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './payment-pending.page.html',
  styleUrls: ['./payment-pending.page.scss']
})
export class PaymentPendingPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly currencyCode = APP_CONSTANTS.currencyCode;

  orderId: number | null = null;
  amount: number | null = null;

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.orderId = navigation.extras.state['orderId'];
      this.amount = navigation.extras.state['amount'];
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idParam = params['orderId'];
      if (idParam) {
        this.orderId = +idParam;
      }
    });
  }

  onCompletePayment(): void {
    if (!this.orderId) {
      this.router.navigate(['/']);
      return;
    }
    // Navigate straight back to the processing page since status is INITIATED
    this.router.navigate(['/payment', this.orderId]);
  }
}

