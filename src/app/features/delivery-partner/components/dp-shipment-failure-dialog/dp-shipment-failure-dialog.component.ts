import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface DpShipmentFailureDialogData {
  trackingNumber: string;
}

export interface DpShipmentFailureDialogResult {
  failureReason: string;
}

@Component({
  selector: 'app-dp-shipment-failure-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './dp-shipment-failure-dialog.html',
  styleUrls: ['./dp-shipment-failure-dialog.scss']
})
export class DpShipmentFailureDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<DpShipmentFailureDialogComponent, DpShipmentFailureDialogResult>);
  readonly data = inject<DpShipmentFailureDialogData>(MAT_DIALOG_DATA);

  failureReason = '';

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (!this.failureReason.trim()) return;
    this.dialogRef.close({ failureReason: this.failureReason.trim() });
  }
}
