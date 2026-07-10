import { Component, Inject, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { AdminOrder } from '../../../../../core/models/admin-order.model';
import { AdminOrdersService } from '../../../../../core/services/admin-orders.service';

@Component({
  selector: 'app-order-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    CurrencyPipe,
    DatePipe
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Order Details</h2>
      <button mat-icon-button mat-dialog-close aria-label="Close dialog">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="modern-dialog-content">
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="error" class="error-container">
        <mat-icon color="warn">error_outline</mat-icon>
        <p>{{ error }}</p>
      </div>

      <div *ngIf="!loading && !error && order" class="order-details-content">
        <div class="order-header-info">
          <div>
            <h3>Order #{{ order.orderId }}</h3>
            <span class="date-text">Placed on: {{ order.createdAt | date:'medium' }}</span>
          </div>
          <div class="status-chip" [ngClass]="getStatusClass(order.status)">
            {{ order.status }}
          </div>
        </div>

        <mat-divider></mat-divider>

        <div class="info-grid">
          <div class="info-column">
            <h4>Customer Information</h4>
            <p class="font-medium text-main">{{ order.userName }}</p>
            <p class="text-sub">{{ order.email }}</p>
            <p class="text-sub">Phone: {{ order.phoneNo }}</p>
          </div>
          <div class="info-column">
            <h4>Shipping Address</h4>
            <p class="text-main address-text">{{ order.address }}</p>
          </div>
        </div>

        <mat-divider></mat-divider>

        <div class="items-section">
          <h4>Order Items</h4>
          <div class="item-list">
            <div *ngFor="let item of order.items" class="item-row">
              <div class="item-details">
                <span class="item-name">{{ item.productName }}</span>
                <span class="item-meta">Product ID: {{ item.productId }}</span>
              </div>
              <div class="item-price">
                <span class="price-calc">{{ item.quantity }} x {{ item.price | currency:'INR':'symbol-narrow':'1.2-2' }}</span>
                <strong class="item-total">{{ (item.quantity * item.price) | currency:'INR':'symbol-narrow':'1.2-2' }}</strong>
              </div>
            </div>
          </div>
        </div>

        <mat-divider></mat-divider>

        <div class="order-summary">
          <div class="summary-row total">
            <span>Total Amount</span>
            <span>{{ order.total | currency:'INR':'symbol-narrow':'1.2-2' }}</span>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="modern-dialog-actions">
      <button mat-button mat-dialog-close class="shared-button shared-button--secondary">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 1.5rem 0.5rem 1.5rem;
      border-bottom: 1px solid rgba(87, 61, 44, 0.08);

      h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--color-neutral-900);
        letter-spacing: -0.02em;
      }

      button {
        color: var(--color-neutral-600);
        &:hover {
          color: var(--color-brand-500);
          background: rgba(181, 95, 52, 0.05);
        }
      }
    }

    .modern-dialog-content {
      padding: 1.5rem !important;
      max-height: 70vh;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      min-height: 200px;
    }

    .error-container {
      color: var(--color-danger-600);
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
      }
      p {
        font-weight: 600;
        margin: 0;
      }
    }

    .order-details-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      min-width: 500px;
      font-family: 'Inter', sans-serif;
    }

    .order-header-info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0 0 4px 0;
        font-size: 1.3rem;
        font-weight: 750;
        color: var(--color-neutral-900);
      }
      .date-text {
        font-size: 0.875rem;
        color: var(--color-neutral-600);
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 24px;

      h4 {
        margin: 0 0 10px 0;
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--color-neutral-600);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      p {
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.6;
      }
      
      .address-text {
        white-space: pre-wrap;
      }
    }

    .items-section {
      h4 {
        margin: 0 0 12px 0;
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--color-neutral-600);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .item-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: var(--color-surface-soft);
      border: 1px solid rgba(87, 61, 44, 0.06);
      border-radius: 12px;

      .item-details {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .item-name {
          font-weight: 600;
          color: var(--color-neutral-900);
        }

        .item-meta {
          font-size: 0.8rem;
          color: var(--color-neutral-600);
        }
      }

      .item-price {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;

        .price-calc {
          font-size: 0.85rem;
          color: var(--color-neutral-600);
        }

        .item-total {
          font-weight: 700;
          color: var(--color-neutral-900);
        }
      }
    }

    .order-summary {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
      padding-top: 8px;

      .summary-row {
        display: flex;
        justify-content: space-between;
        width: 280px;

        &.total {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-neutral-900);
          padding-top: 8px;
        }
      }
    }

    /* Status Chip Styles */
    .status-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.35rem 0.85rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: 1px solid transparent;

      &.status-placed {
        background: var(--color-info-050);
        color: var(--color-info-700);
        border-color: rgba(77, 61, 52, 0.2);
      }
      &.status-shipped {
        background: var(--color-warning-050);
        color: var(--color-warning-700);
        border-color: rgba(138, 100, 51, 0.2);
      }
      &.status-delivered {
        background: var(--color-success-050);
        color: var(--color-success-700);
        border-color: rgba(75, 106, 80, 0.2);
      }
      &.status-cancelled {
        background: var(--color-danger-050);
        color: var(--color-danger-600);
        border-color: var(--color-danger-border);
      }
    }

    .font-medium {
      font-weight: 600;
    }
    .text-main {
      color: var(--color-neutral-900);
    }
    .text-sub {
      color: var(--color-neutral-600);
    }

    .modern-dialog-actions {
      padding: 1rem 1.5rem !important;
      border-top: 1px solid rgba(87, 61, 44, 0.08);
    }

    /* Responsive adjustments */
    @media (max-width: 600px) {
      .order-details-content {
        min-width: 100%;
      }
      .info-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  `]
})
export class OrderDetailsDialogComponent implements OnInit {
  order: AdminOrder | null = null;
  loading = true;
  error = '';

  private adminOrdersService = inject(AdminOrdersService);
  private cdr = inject(ChangeDetectorRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { orderId: number }) {}

  ngOnInit(): void {
    this.loadOrderDetails();
  }

  loadOrderDetails(): void {
    this.loading = true;
    this.error = '';

    this.adminOrdersService.getOrderDetails(this.data.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('OrderDetailsDialogComponent: API error:', err);
        this.error = 'Failed to load order details. Please try again.';
        this.loading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CONFIRMED':
      case 'PENDING_PAYMENT': return 'status-placed';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }
}
