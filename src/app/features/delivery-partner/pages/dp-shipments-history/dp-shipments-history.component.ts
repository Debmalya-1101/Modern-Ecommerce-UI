import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { finalize } from 'rxjs';

import { DeliveryPartnerShipmentsService } from '../../../../core/services/delivery-partner-shipments.service';
import { ShipmentResponseDTO } from '../../../../core/models/shipment.model';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state.component';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';

@Component({
  selector: 'app-dp-shipments-history',
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
  templateUrl: './dp-shipments-history.html',
  styleUrls: ['./dp-shipments-history.scss']
})
export class DpShipmentsHistoryComponent implements OnInit {
  private readonly shipmentsService = inject(DeliveryPartnerShipmentsService);

  readonly shipments = signal<ShipmentResponseDTO[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  // Pagination
  protected totalElements = signal(0);
  protected pageSize = signal(10);
  protected pageIndex = signal(0);

  ngOnInit(): void {
    this.loadHistoryShipments();
  }

  loadHistoryShipments(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.shipmentsService.getShipmentHistory(this.pageIndex(), this.pageSize())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (pageResponse) => {
          this.shipments.set(pageResponse.content);
          this.totalElements.set(pageResponse.totalElements);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to load shipment history');
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadHistoryShipments();
  }
}
