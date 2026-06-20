import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { finalize, forkJoin } from 'rxjs';

import { AdminDeliveryPartnersService } from '../../../../core/services/admin-delivery-partners.service';
import { DeliveryFeedbackService } from '../../../../core/services/delivery-feedback.service';
import { DeliveryPartnerResponseDTO, DeliveryPartnerStatus } from '../../../../core/models/delivery-partner.model';
import { DeliveryPartnerRatingSummaryDTO } from '../../../../core/models/delivery-feedback.model';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { AdminDpDetailDialogComponent, AdminDpDetailDialogData, AdminDpDetailDialogResult } from './components/admin-dp-detail-dialog/admin-dp-detail-dialog.component';

export interface PartnerRowData extends DeliveryPartnerResponseDTO {
  ratingSummary?: DeliveryPartnerRatingSummaryDTO;
}

@Component({
  selector: 'app-admin-delivery-partners',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    LoadingSpinnerComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  templateUrl: './admin-delivery-partners.html',
  styleUrls: ['./admin-delivery-partners.scss']
})
export class AdminDeliveryPartnersComponent implements OnInit {
  private readonly partnersService = inject(AdminDeliveryPartnersService);
  private readonly feedbackService = inject(DeliveryFeedbackService);
  private readonly dialog = inject(MatDialog);
  private readonly snackbarService = inject(SnackbarService);

  readonly displayedColumns: string[] = ['fullName', 'emailId', 'vehicleType', 'rating', 'status', 'actions'];
  readonly StatusEnum = DeliveryPartnerStatus;

  readonly partners = signal<PartnerRowData[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  
  readonly statusFilter = signal<DeliveryPartnerStatus | 'ALL'>('ALL');

  readonly filteredPartners = computed(() => {
    const filter = this.statusFilter();
    if (filter === 'ALL') {
      return this.partners();
    }
    return this.partners().filter(p => p.status === filter);
  });

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    forkJoin({
      partners: this.partnersService.getPartners(),
      ratings: this.feedbackService.getAdminPartnerRatings()
    })
    .pipe(finalize(() => this.isLoading.set(false)))
    .subscribe({
      next: ({ partners, ratings }) => {
        const ratingsMap = new Map<number, DeliveryPartnerRatingSummaryDTO>();
        ratings.forEach((r: DeliveryPartnerRatingSummaryDTO) => ratingsMap.set(r.deliveryPartnerId, r));
        
        const mappedPartners = partners.map(p => ({
          ...p,
          ratingSummary: ratingsMap.get(p.id)
        }));
        
        this.partners.set(mappedPartners);
      },
      error: (err: any) => this.error.set(err.error?.message || 'Failed to load delivery partners')
    });
  }

  onFilterChange(status: DeliveryPartnerStatus | 'ALL'): void {
    this.statusFilter.set(status);
  }

  viewPartnerDetails(partner: PartnerRowData): void {
    const dialogRef = this.dialog.open(AdminDpDetailDialogComponent, {
      width: '600px', // Increased width for tabs
      data: { partner }
    });

    dialogRef.afterClosed().subscribe((result: AdminDpDetailDialogResult | undefined) => {
      if (result?.action === 'UPDATE_STATUS') {
        this.updatePartnerStatus(partner.id, result.status);
      }
    });
  }

  private updatePartnerStatus(partnerId: number, status: DeliveryPartnerStatus): void {
    this.isLoading.set(true);
    this.partnersService.updatePartnerStatus(partnerId, { status })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (updatedPartner: DeliveryPartnerResponseDTO) => {
          this.snackbarService.success(`Delivery partner status updated to ${status}`);
          this.loadPartners(); // Refresh list
        },
        error: (err: any) => {
          this.snackbarService.error(err.error?.message || 'Failed to update partner status');
        }
      });
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
