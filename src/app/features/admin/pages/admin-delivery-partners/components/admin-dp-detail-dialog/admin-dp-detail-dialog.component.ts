import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { DeliveryPartnerResponseDTO, DeliveryPartnerStatus } from '../../../../../../core/models/delivery-partner.model';
import { DeliveryFeedbackService } from '../../../../../../core/services/delivery-feedback.service';
import { AdminDeliveryFeedbackResponseDTO } from '../../../../../../core/models/delivery-feedback.model';

export interface AdminDpDetailDialogData {
  partner: DeliveryPartnerResponseDTO;
}

export interface AdminDpDetailDialogResult {
  action: 'UPDATE_STATUS';
  status: DeliveryPartnerStatus;
}

@Component({
  selector: 'app-admin-dp-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './admin-dp-detail-dialog.html',
  styleUrls: ['./admin-dp-detail-dialog.scss']
})
export class AdminDpDetailDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AdminDpDetailDialogComponent, AdminDpDetailDialogResult>);
  private readonly feedbackService = inject(DeliveryFeedbackService);
  readonly data = inject<AdminDpDetailDialogData>(MAT_DIALOG_DATA);
  readonly partner = this.data.partner;
  readonly StatusEnum = DeliveryPartnerStatus;

  readonly feedbackList = signal<AdminDeliveryFeedbackResponseDTO[]>([]);
  readonly isLoadingFeedback = signal<boolean>(true);
  readonly feedbackError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFeedback();
  }

  loadFeedback(): void {
    this.isLoadingFeedback.set(true);
    this.feedbackError.set(null);
    this.feedbackService.getAdminPartnerFeedback(this.partner.id).subscribe({
      next: (list) => {
        this.feedbackList.set(list);
        this.isLoadingFeedback.set(false);
      },
      error: (err) => {
        console.error('Error loading partner feedback:', err);
        this.feedbackError.set('Failed to load feedback history.');
        this.isLoadingFeedback.set(false);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  updateStatus(status: DeliveryPartnerStatus): void {
    this.dialogRef.close({ action: 'UPDATE_STATUS', status });
  }

  getStatusColor(status: DeliveryPartnerStatus): string {
    switch (status) {
      case DeliveryPartnerStatus.APPROVED: return 'primary';
      case DeliveryPartnerStatus.REJECTED: return 'warn';
      case DeliveryPartnerStatus.SUSPENDED: return 'warn';
      default: return 'accent';
    }
  }
}
