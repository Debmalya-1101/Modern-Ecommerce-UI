import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

import { DeliveryFeedbackService } from '../../../../core/services/delivery-feedback.service';

export interface DeliveryFeedbackDialogData {
  orderId: number;
}

@Component({
  selector: 'app-delivery-feedback-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSliderModule
  ],
  templateUrl: './delivery-feedback-dialog.html',
  styleUrls: ['./delivery-feedback-dialog.scss']
})
export class DeliveryFeedbackDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<DeliveryFeedbackDialogComponent>);
  readonly data = inject<DeliveryFeedbackDialogData>(MAT_DIALOG_DATA);
  private readonly feedbackService = inject(DeliveryFeedbackService);

  rating = 5;
  comment = '';
  isSubmitting = false;
  error: string | null = null;

  submit(): void {
    if (this.rating < 1 || this.rating > 5) {
      this.error = 'Rating must be between 1 and 5';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    this.feedbackService.submitFeedback(this.data.orderId, {
      rating: this.rating,
      comment: this.comment
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        console.error('Failed to submit feedback:', err);
        this.error = err.error?.message || 'Failed to submit feedback. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
