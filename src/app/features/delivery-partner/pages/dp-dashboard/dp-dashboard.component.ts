import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import { DeliveryPartnerShipmentsService } from '../../../../core/services/delivery-partner-shipments.service';
import { DeliveryPartnerDashboardDTO } from '../../../../core/models/delivery-partner.model';
import { LoadingSpinnerComponent } from '../../../../shared/ui/loading-spinner/loading-spinner.component';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state.component';

@Component({
  selector: 'app-dp-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LoadingSpinnerComponent,
    ErrorStateComponent
  ],
  templateUrl: './dp-dashboard.html',
  styleUrls: ['./dp-dashboard.scss']
})
export class DpDashboardComponent implements OnInit {
  private readonly shipmentsService = inject(DeliveryPartnerShipmentsService);

  readonly dashboardData = signal<DeliveryPartnerDashboardDTO | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.shipmentsService.getDashboard()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.dashboardData.set(data);
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to load dashboard data');
        }
      });
  }
}
