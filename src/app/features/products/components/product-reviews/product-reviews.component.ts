import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../../core/services/auth.service';
import { ReviewsApiService } from '../../../../core/services/reviews-api.service';
import { ReviewDTO } from '../../../../core/models/review.model';
import { PageResponse } from '../../../../core/models/api.model';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { ProductRatingDisplayComponent } from '../../../../shared/ui/product/product-rating-display/product-rating-display.component';

interface RatingDistribution {
  star: number;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    ProductRatingDisplayComponent
  ],
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss']
})
export class ProductReviewsComponent implements OnInit {
  @Input({ required: true }) productId!: number;

  private readonly authService = inject(AuthService);
  private readonly reviewsApi = inject(ReviewsApiService);
  private readonly dialog = inject(MatDialog);
  private readonly snackbar = inject(SnackbarService);

  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly currentUserName = computed(() => this.authService.session().user?.username);

  readonly isLoading = signal(false);
  readonly isLoadingMore = signal(false);
  readonly reviews = signal<ReviewDTO[]>([]);
  readonly pageData = signal<PageResponse<ReviewDTO> | null>(null);
  
  // Calculated dynamically from loaded reviews for a realistic look based on visible data
  readonly averageRating = computed(() => {
    const all = this.reviews();
    if (!all.length) return 0;
    const sum = all.reduce((acc, rev) => acc + rev.rating, 0);
    return sum / all.length;
  });

  readonly ratingDistribution = computed((): RatingDistribution[] => {
    const all = this.reviews();
    const total = all.length;
    const dist = [5, 4, 3, 2, 1].map(star => {
      const count = all.filter(r => r.rating === star).length;
      return {
        star,
        count,
        percentage: total ? (count / total) * 100 : 0
      };
    });
    return dist;
  });

  readonly hasUserReviewed = computed(() => {
    const uname = this.currentUserName();
    if (!uname) return false;
    return this.reviews().some(r => r.userName === uname);
  });

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.loadReviews();
    }
  }

  loadReviews(page = 0): void {
    if (page === 0) {
      this.isLoading.set(true);
    } else {
      this.isLoadingMore.set(true);
    }

    this.reviewsApi.getProductReviews(this.productId, page, 5).subscribe({
      next: (response) => {
        if (page === 0) {
          this.reviews.set(response.content);
        } else {
          this.reviews.update(prev => [...prev, ...response.content]);
        }
        this.pageData.set(response);
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.isLoadingMore.set(false);
        // Silently fail or show minimal error so it doesn't break the product page
        console.error('Failed to load reviews', err);
      }
    });
  }

  loadMore(): void {
    const current = this.pageData();
    if (current && !current.last) {
      this.loadReviews(current.pageNumber + 1);
    }
  }

  openReviewDialog(review?: ReviewDTO): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '500px',
      data: {
        productId: this.productId,
        review
      }
    });

    dialogRef.afterClosed().subscribe((result: ReviewDTO) => {
      if (result) {
        if (review) {
          // Edit mode: update existing
          this.reviews.update(all => all.map(r => r.id === result.id ? result : r));
        } else {
          // Create mode: add to top
          this.reviews.update(all => [result, ...all]);
        }
      }
    });
  }

  deleteReview(reviewId: number): void {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    this.reviewsApi.deleteReview(reviewId).subscribe({
      next: () => {
        this.snackbar.success('Review deleted successfully.');
        this.reviews.update(all => all.filter(r => r.id !== reviewId));
      },
      error: (err) => {
        this.snackbar.error(err.message || 'Failed to delete review.');
      }
    });
  }
}
