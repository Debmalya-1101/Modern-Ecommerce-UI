import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { finalize } from 'rxjs';

import { AdminShipmentsService } from '../../../../core/services/admin-shipments.service';
import { ShipmentResponseDTO } from '../../../../core/models/shipment.model';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { AdminShipmentAssignDialogComponent, AdminShipmentAssignDialogData, AdminShipmentAssignDialogResult } from './components/admin-shipment-assign-dialog/admin-shipment-assign-dialog.component';
import { StatusFormatPipe } from '../../../../shared/pipes/status-format.pipe';

@Component({
  selector: 'app-admin-shipments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    LoadingSpinnerComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    DatePipe,
    StatusFormatPipe
  ],
  templateUrl: './admin-shipments.html',
  styleUrls: ['./admin-shipments.scss']
})
export class AdminShipmentsComponent implements OnInit {
  private readonly shipmentsService = inject(AdminShipmentsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackbarService = inject(SnackbarService);

  readonly displayedColumns: string[] = ['trackingNumber', 'orderId', 'expectedDelivery', 'status', 'actions'];
  
  readonly shipments = signal<ShipmentResponseDTO[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // Pagination
  protected totalElements = signal(0);
  protected pageSize = signal(10);
  protected pageIndex = signal(0);

  ngOnInit(): void {
    this.loadUnassignedShipments();
  }

  loadUnassignedShipments(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.shipmentsService.getUnassignedShipments(this.pageIndex(), this.pageSize())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (pageResponse) => {
          this.shipments.set(pageResponse.content);
          this.totalElements.set(pageResponse.totalElements);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to load unassigned shipments');
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadUnassignedShipments();
  }

  openAssignDialog(shipment: ShipmentResponseDTO): void {
    const dialogRef = this.dialog.open(AdminShipmentAssignDialogComponent, {
      width: '550px',
      data: { shipment }
    });

    dialogRef.afterClosed().subscribe((result?: AdminShipmentAssignDialogResult) => {
      if (result && result.assignedPartnerId) {
        this.assignShipment(shipment.id, result.assignedPartnerId);
      }
    });
  }

  private assignShipment(shipmentId: number, partnerId: number): void {
    this.shipmentsService.assignShipment(shipmentId, partnerId).subscribe({
      next: (updatedShipment) => {
        this.snackbarService.success(`Shipment assigned successfully to partner.`);
        // Remove the assigned shipment from the unassigned list
        this.shipments.update(list => list.filter(s => s.id !== shipmentId));
      },
      error: (err) => {
        this.snackbarService.error(err.error?.message || 'Failed to assign shipment.');
      }
    });
  }
}
