import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-stock-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>Update Stock</h2>
    <mat-dialog-content>
      <form [formGroup]="stockForm" (ngSubmit)="onSubmit()" class="dialog-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Current Stock Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" min="0" required>
          <mat-error *ngIf="stockForm.get('quantity')?.hasError('required')">Stock quantity is required</mat-error>
          <mat-error *ngIf="stockForm.get('quantity')?.hasError('min')">Stock quantity cannot be negative</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="stockForm.invalid" (click)="onSubmit()">Update Stock</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      padding-top: 1rem;
      min-width: 300px;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class StockDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<StockDialogComponent>);
  public data = inject(MAT_DIALOG_DATA) as { currentStock: number };

  stockForm = this.fb.group({
    quantity: [this.data.currentStock, [Validators.required, Validators.min(0)]]
  });

  onSubmit() {
    if (this.stockForm.valid) {
      this.dialogRef.close(this.stockForm.value.quantity);
    }
  }
}
