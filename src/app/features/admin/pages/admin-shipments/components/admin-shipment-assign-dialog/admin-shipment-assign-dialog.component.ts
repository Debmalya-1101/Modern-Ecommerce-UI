import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { ShipmentResponseDTO } from '../../../../../../core/models/shipment.model';
import { DeliveryPartnerResponseDTO, DeliveryPartnerStatus } from '../../../../../../core/models/delivery-partner.model';
import { AdminDeliveryPartnersService } from '../../../../../../core/services/admin-delivery-partners.service';
import { ConfirmationDialogService } from '../../../../../../shared/services/confirmation-dialog.service';

export interface AdminShipmentAssignDialogData {
  shipment: ShipmentResponseDTO;
}

export interface AdminShipmentAssignDialogResult {
  assignedPartnerId: number;
}

@Component({
  selector: 'app-admin-shipment-assign-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './admin-shipment-assign-dialog.html',
  styleUrls: ['./admin-shipment-assign-dialog.scss']
})
export class AdminShipmentAssignDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AdminShipmentAssignDialogComponent, AdminShipmentAssignDialogResult>);
  readonly data = inject<AdminShipmentAssignDialogData>(MAT_DIALOG_DATA);
  private readonly partnersService = inject(AdminDeliveryPartnersService);
  private readonly confirmationDialogService = inject(ConfirmationDialogService);

  readonly availablePartners = signal<DeliveryPartnerResponseDTO[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  
  readonly shipment = this.data.shipment;

  selectedPartnerId: number | null = null;

  ngOnInit(): void {
    this.loadApprovedPartners();
  }

  loadApprovedPartners(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.partnersService.getPartners(DeliveryPartnerStatus.APPROVED)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: DeliveryPartnerResponseDTO[]) => {
          this.availablePartners.set(response);
        },
        error: (err: any) => {
          this.error.set(err.error?.message || 'Failed to load approved partners');
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  confirmAssignment(): void {
    if (!this.selectedPartnerId) return;

    const partner = this.availablePartners().find(p => p.id === this.selectedPartnerId);
    if (!partner) return;

    this.confirmationDialogService.open({
      title: 'Confirm Assignment',
      message: `Are you sure you want to assign shipment ${this.data.shipment.trackingNumber} to ${partner.fullName}?`,
      confirmLabel: 'Assign Shipment',
      cancelLabel: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.executeAssignment(partner.id);
      }
    });
  }

  private executeAssignment(partnerId: number): void {
    this.dialogRef.close({ assignedPartnerId: partnerId });
  }
}
