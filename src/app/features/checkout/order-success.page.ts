import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order-success-page',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="success-container">
      <div class="success-card">
        <div class="icon-circle">
          <mat-icon>check_circle</mat-icon>
        </div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for shopping with us. Your order has been placed and is being processed.</p>
        
        <div class="actions">
          <button mat-flat-button color="primary" routerLink="/orders">
            View My Orders
          </button>
          <button mat-stroked-button routerLink="/">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 140px); /* Approximate height minus header/footer */
      padding: 2rem;
    }

    .success-card {
      background: var(--surface-card);
      padding: 3rem 2rem;
      border-radius: 16px;
      box-shadow: var(--shadow-md);
      text-align: center;
      max-width: 500px;
      width: 100%;
    }

    .icon-circle {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(76, 175, 80, 0.1);
      margin-bottom: 1.5rem;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #4CAF50;
      }
    }

    h1 {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }

    p {
      color: var(--text-secondary);
      font-size: 1.125rem;
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      @media (min-width: 480px) {
        flex-direction: row;
        justify-content: center;
      }

      button {
        min-width: 160px;
        padding: 1.5rem;
        font-size: 1rem;
        border-radius: 8px;
      }
    }
  `]
})
export class OrderSuccessPage {}
