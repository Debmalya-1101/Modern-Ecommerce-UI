import { Component, OnInit, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ActivatedRoute } from '@angular/router';
import { AdminNotificationService } from '../../../core/services/admin-notification.service';
import { NotificationLogDTO } from '../../../core/models/admin-notification.model';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    StatusFormatPipe
  ],
  templateUrl: './admin-notifications.page.html',
  styleUrl: './admin-notifications.page.scss'
})
export class AdminNotificationsPage implements OnInit {
  
  private readonly notificationService = inject(AdminNotificationService);
  private readonly cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['referenceId', 'type', 'recipient', 'status', 'createdAt', 'retryCount', 'actions'];
  dataSource: NotificationLogDTO[] = [];
  
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  
  isLoading = true;
  hasError = false;
  
  selectedFilter: string = 'ALL';

  private readonly route = inject(ActivatedRoute);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const statusParam = params.get('status');
      if (statusParam && ['SENT', 'FAILED', 'PENDING'].includes(statusParam.toUpperCase())) {
        this.selectedFilter = statusParam.toUpperCase();
      }
      this.loadLogs();
    });
  }

  loadLogs(): void {
    this.isLoading = true;
    this.hasError = false;
    
    this.notificationService.getNotificationLogs(this.pageIndex, this.pageSize, this.selectedFilter)
      .subscribe({
        next: (response: any) => {
          this.dataSource = response?.content || (Array.isArray(response) ? response : []);
          this.totalElements = response?.totalElements || this.dataSource.length;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load notification logs', err);
          this.hasError = true;
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLogs();
  }

  onFilterChange(value: string): void {
    this.selectedFilter = value;
    this.pageIndex = 0;
    this.loadLogs();
  }

  retry(): void {
    this.loadLogs();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SENT': return 'status-sent';
      case 'FAILED': return 'status-failed';
      case 'PENDING': return 'status-pending';
      default: return '';
    }
  }
}
