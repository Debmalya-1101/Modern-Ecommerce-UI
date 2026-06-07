import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { APP_CONSTANTS } from '../../core/config/app.constants';

@Component({
  selector: 'app-payment-success-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './payment-success.page.html',
  styleUrls: ['./payment-success.page.scss']
})
export class PaymentSuccessPage {
  private readonly router = inject(Router);
  
  readonly currencyCode = APP_CONSTANTS.currencyCode;
  
  orderId: number | null = null;
  amount: number | null = null;
  referenceId: string | null = null;

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.orderId = navigation.extras.state['orderId'];
      this.amount = navigation.extras.state['amount'];
      this.referenceId = navigation.extras.state['referenceId'];
    }
  }
}
