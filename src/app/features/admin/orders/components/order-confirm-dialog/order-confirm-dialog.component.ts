import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

export interface OrderConfirmDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  color: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-order-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ data.cancelText }}</button>
      <button mat-flat-button [color]="data.color" [mat-dialog-close]="true">
        {{ data.confirmText }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 300px;
    }
  `]
})
export class OrderConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OrderConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderConfirmDialogData
  ) {}
}
