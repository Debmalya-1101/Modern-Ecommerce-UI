import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DeliveryFeedbackService } from '../../../../core/services/delivery-feedback.service';
import { DeliveryFeedbackResponseDTO, DeliveryPartnerRatingSummaryDTO } from '../../../../core/models/delivery-feedback.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dp-feedback',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dp-feedback.html',
  styleUrls: ['./dp-feedback.scss']
})
export class DpFeedbackComponent implements OnInit {
  private readonly feedbackService = inject(DeliveryFeedbackService);

  readonly summary = signal<DeliveryPartnerRatingSummaryDTO | null>(null);
  readonly feedbackList = signal<DeliveryFeedbackResponseDTO[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Load summary
    this.feedbackService.getPartnerFeedbackSummary().subscribe({
      next: (summary) => this.summary.set(summary),
      error: (err) => {
        console.error('Error loading summary', err);
        this.error.set('Failed to load feedback summary.');
      }
    });

    // Load feedback list
    this.feedbackService.getPartnerFeedback().subscribe({
      next: (list) => {
        this.feedbackList.set(list);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading feedback list', err);
        this.error.set('Failed to load feedback list.');
        this.isLoading.set(false);
      }
    });
  }

  generateStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }
}
