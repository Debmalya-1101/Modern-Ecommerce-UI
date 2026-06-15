import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { InventoryAdjustmentRequest } from '../../../../../core/models/admin-inventory.model';

@Component({
  selector: 'app-inventory-adjustment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title style="font-family: 'Outfit', sans-serif; font-weight: 700; color: var(--color-neutral-900);">Adjust Stock Levels</h2>
    <mat-dialog-content>
      <p class="dialog-subtitle">Product: <strong>{{ data.productName }}</strong></p>
      
      <form [formGroup]="form" class="adjustment-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Adjustment Type</mat-label>
          <mat-select formControlName="type">
            <mat-option value="ADD">Add Stock (+)</mat-option>
            <mat-option value="REMOVE">Remove Stock (-)</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" min="1" placeholder="e.g. 5">
          <mat-error *ngIf="form.get('quantity')?.hasError('required')">Quantity is required</mat-error>
          <mat-error *ngIf="form.get('quantity')?.hasError('min')">Must be at least 1</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Reference Type</mat-label>
          <mat-select formControlName="referenceType">
            <mat-option value="MANUAL_ADJUSTMENT">Manual Adjustment</mat-option>
            <mat-option value="RETURN">Customer Return</mat-option>
            <mat-option value="DAMAGE">Damaged Goods</mat-option>
            <mat-option value="LOST">Lost in Transit</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Reference ID (Optional)</mat-label>
          <input matInput formControlName="referenceId" placeholder="e.g. INCIDENT-123">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Notes / Reason</mat-label>
          <textarea matInput formControlName="notes" rows="3" placeholder="Provide details for this adjustment..."></textarea>
          <mat-error *ngIf="form.get('notes')?.hasError('required')">Notes are required</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" style="gap: 8px;">
      <button mat-button mat-dialog-close class="shared-button shared-button--secondary">Cancel</button>
      <button mat-flat-button class="shared-button shared-button--primary" [disabled]="form.invalid" (click)="onSubmit()">
        Confirm Adjustment
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-subtitle {
      margin-top: 0;
      margin-bottom: 24px;
      color: var(--color-neutral-600);
      font-size: 0.95rem;
    }
    .adjustment-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 420px;
      padding-top: 8px;
      @media (max-width: 600px) {
        min-width: 100%;
      }
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class AdjustmentDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdjustmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productName: string }
  ) {
    this.form = this.fb.group({
      type: ['ADD', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      referenceType: ['MANUAL_ADJUSTMENT', Validators.required],
      referenceId: [''],
      notes: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const val = this.form.value;
      const quantityDelta = val.type === 'ADD' ? val.quantity : -val.quantity;
      
      const request: InventoryAdjustmentRequest = {
        quantityDelta,
        referenceType: val.referenceType,
        referenceId: val.referenceId || `MANUAL-${Date.now()}`,
        notes: val.notes
      };
      
      this.dialogRef.close(request);
    }
  }
}
