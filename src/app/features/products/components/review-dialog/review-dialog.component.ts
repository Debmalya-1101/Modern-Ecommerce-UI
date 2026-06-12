import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonStyleDirective } from '../../../../shared/directives/button-style.directive';

import { AppHttpError } from '../../../../core/models/api.model';
import { ReviewDTO } from '../../../../core/models/review.model';
import { ReviewsApiService } from '../../../../core/services/reviews-api.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

export interface ReviewDialogData {
  productId: number;
  review?: ReviewDTO; // If passed, we are in Edit mode
}

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ButtonStyleDirective
  ],
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss']
})
export class ReviewDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly reviewsApi = inject(ReviewsApiService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialogRef = inject(MatDialogRef<ReviewDialogComponent>);

  readonly isSubmitting = signal(false);
  readonly stars = [1, 2, 3, 4, 5];

  reviewForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ReviewDialogData) {
    this.reviewForm = this.fb.group({
      rating: [this.data.review?.rating || 0, [Validators.required, Validators.min(1), Validators.max(5)]],
      reviewText: [
        this.data.review?.reviewText || '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(500)]
      ]
    });
  }

  get isEditMode(): boolean {
    return !!this.data.review;
  }

  setRating(rating: number): void {
    if (this.isSubmitting()) return;
    this.reviewForm.get('rating')?.setValue(rating);
    this.reviewForm.get('rating')?.markAsTouched();
  }

  onSubmit(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.reviewForm.value;

    if (this.isEditMode && this.data.review) {
      this.reviewsApi.updateReview(this.data.review.id, formValue).subscribe({
        next: (updatedReview) => {
          this.snackbar.success('Review updated successfully.');
          this.dialogRef.close(updatedReview);
        },
        error: (err: AppHttpError) => {
          this.isSubmitting.set(false);
          this.snackbar.error(err.message || 'Failed to update review.');
        }
      });
    } else {
      const createPayload = {
        productId: this.data.productId,
        ...formValue
      };

      this.reviewsApi.createReview(createPayload).subscribe({
        next: (newReview) => {
          this.snackbar.success('Review submitted successfully.');
          this.dialogRef.close(newReview);
        },
        error: (err: AppHttpError) => {
          this.isSubmitting.set(false);
          this.snackbar.error(err.message || 'Failed to submit review.');
        }
      });
    }
  }
}
