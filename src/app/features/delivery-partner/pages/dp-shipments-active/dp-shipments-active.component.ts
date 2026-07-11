import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { DeliveryPartnerShipmentsService } from '../../../../core/services/delivery-partner-shipments.service';
import { ShipmentResponseDTO, ShipmentStatus } from '../../../../core/models/shipment.model';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ConfirmationDialogService } from '../../../../shared/services/confirmation-dialog.service';
import { DpShipmentFailureDialogComponent, DpShipmentFailureDialogResult } from '../../components/dp-shipment-failure-dialog/dp-shipment-failure-dialog.component';

@Component({
  selector: 'app-dp-shipments-active',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    LoadingSpinnerComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    DatePipe
  ],
  templateUrl: './dp-shipments-active.html',
  styleUrls: ['./dp-shipments-active.scss']
})
export class DpShipmentsActiveComponent implements OnInit {
  private readonly shipmentsService = inject(DeliveryPartnerShipmentsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackbarService = inject(SnackbarService);
  private readonly confirmationDialogService = inject(ConfirmationDialogService);

  readonly shipments = signal<ShipmentResponseDTO[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly StatusEnum = ShipmentStatus;

  // Pagination
  protected totalElements = signal(0);
  protected pageSize = signal(10);
  protected pageIndex = signal(0);

  ngOnInit(): void {
    this.loadActiveShipments();
  }

  loadActiveShipments(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.shipmentsService.getActiveShipments(this.pageIndex(), this.pageSize())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (pageResponse) => {
          this.shipments.set(pageResponse.content);
          this.totalElements.set(pageResponse.totalElements);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to load active shipments');
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadActiveShipments();
  }

  updateStatus(shipment: ShipmentResponseDTO, newStatus: ShipmentStatus): void {
    if (newStatus === ShipmentStatus.DELIVERED) {
      this.confirmationDialogService.open({
        title: 'Confirm Delivery',
        message: `Are you sure you want to mark shipment ${shipment.trackingNumber} as delivered?`,
        confirmLabel: 'Mark Delivered',
        cancelLabel: 'Cancel'
      }).subscribe(confirmed => {
        if (confirmed) {
          this.executeStatusUpdate(shipment.id, newStatus);
        }
      });
    } else {
      this.executeStatusUpdate(shipment.id, newStatus);
    }
  }

  markFailed(shipment: ShipmentResponseDTO): void {
    const dialogRef = this.dialog.open(DpShipmentFailureDialogComponent, {
      width: '500px',
      data: { trackingNumber: shipment.trackingNumber }
    });

    dialogRef.afterClosed().subscribe((result?: DpShipmentFailureDialogResult) => {
      if (result && result.failureReason) {
        this.executeStatusUpdate(shipment.id, ShipmentStatus.DELIVERY_FAILED, result.failureReason);
      }
    });
  }

  private executeStatusUpdate(id: number, status: ShipmentStatus, failureReason?: string): void {
    this.shipmentsService.updateShipmentStatus(id, { status, failureReason }).subscribe({
      next: (updated) => {
        this.snackbarService.success(`Shipment status updated to ${status}`);
        // Remove from active list if terminal state (DELIVERED or DELIVERY_FAILED)
        if (status === ShipmentStatus.DELIVERED || status === ShipmentStatus.DELIVERY_FAILED) {
          this.shipments.update(list => list.filter(s => s.id !== id));
        } else {
          // Update in place
          this.shipments.update(list => list.map(s => s.id === id ? updated : s));
        }
      },
      error: (err) => {
        this.snackbarService.error(err.error?.message || 'Failed to update shipment status');
      }
    });
  }
}
