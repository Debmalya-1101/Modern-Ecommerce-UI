import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { DeliveryPartnerShipmentsService } from '../../../../core/services/delivery-partner-shipments.service';
import { ShipmentResponseDTO, ShipmentStatus } from '../../../../core/models/shipment.model';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ConfirmationDialogService } from '../../../../shared/services/confirmation-dialog.service';
import { DpShipmentFailureDialogComponent, DpShipmentFailureDialogResult } from '../../components/dp-shipment-failure-dialog/dp-shipment-failure-dialog.component';

@Component({
  selector: 'app-dp-shipment-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    LoadingSpinnerComponent,
    ErrorStateComponent,
    DatePipe
  ],
  templateUrl: './dp-shipment-detail.html',
  styleUrls: ['./dp-shipment-detail.scss']
})
export class DpShipmentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly shipmentsService = inject(DeliveryPartnerShipmentsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackbarService = inject(SnackbarService);
  private readonly confirmationDialogService = inject(ConfirmationDialogService);

  readonly shipment = signal<ShipmentResponseDTO | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  readonly errorTitle = signal<string | null>(null);
  readonly StatusEnum = ShipmentStatus;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadShipment(id);
      } else {
        this.errorTitle.set('Invalid ID');
        this.error.set('No valid shipment ID provided in the URL.');
        this.isLoading.set(false);
      }
    });
  }

  loadShipment(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.errorTitle.set(null);

    this.shipmentsService.getShipmentDetails(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.shipment.set(data);
        },
        error: (err) => {
          if (err.status === 403) {
            this.errorTitle.set('Access Denied');
            this.error.set('You do not have access to this shipment.');
          } else if (err.status === 404) {
            this.errorTitle.set('Not Found');
            this.error.set('Shipment not found.');
          } else {
            this.errorTitle.set('Error Loading Shipment');
            this.error.set(err.error?.message || 'Failed to load shipment details.');
          }
        }
      });
  }

  updateStatus(newStatus: ShipmentStatus): void {
    const currentShipment = this.shipment();
    if (!currentShipment) return;

    if (newStatus === ShipmentStatus.DELIVERED) {
      this.confirmationDialogService.open({
        title: 'Confirm Delivery',
        message: `Are you sure you want to mark shipment ${currentShipment.trackingNumber} as delivered?`,
        confirmLabel: 'Mark Delivered',
        cancelLabel: 'Cancel'
      }).subscribe(confirmed => {
        if (confirmed) {
          this.executeStatusUpdate(currentShipment.id, newStatus);
        }
      });
    } else {
      this.executeStatusUpdate(currentShipment.id, newStatus);
    }
  }

  markFailed(): void {
    const currentShipment = this.shipment();
    if (!currentShipment) return;

    const dialogRef = this.dialog.open(DpShipmentFailureDialogComponent, {
      width: '500px',
      data: { trackingNumber: currentShipment.trackingNumber }
    });

    dialogRef.afterClosed().subscribe((result?: DpShipmentFailureDialogResult) => {
      if (result && result.failureReason) {
        this.executeStatusUpdate(currentShipment.id, ShipmentStatus.FAILED, result.failureReason);
      }
    });
  }

  private executeStatusUpdate(id: number, status: ShipmentStatus, failureReason?: string): void {
    this.shipmentsService.updateShipmentStatus(id, { status, failureReason }).subscribe({
      next: (updated) => {
        this.snackbarService.success(`Shipment status updated to ${status}`);
        this.shipment.set(updated);
      },
      error: (err) => {
        this.snackbarService.error(err.error?.message || 'Failed to update shipment status');
      }
    });
  }
}
