import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';

import { AdminOrder } from '../../../core/models/admin-order.model';
import { AdminOrdersService } from '../../../core/services/admin-orders.service';
import { OrderDetailsDialogComponent } from './components/order-details-dialog/order-details-dialog.component';
import { AdminCancelOrderDialogComponent } from './components/admin-cancel-order-dialog/admin-cancel-order-dialog.component';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatCardModule,
    CurrencyPipe,
    DatePipe,
    StatusFormatPipe
  ],
  templateUrl: './admin-orders.page.html',
  styleUrl: './admin-orders.page.scss'
})
export class AdminOrdersPage implements OnInit {
  displayedColumns: string[] = ['orderId', 'createdAt', 'total', 'status', 'actions'];
  dataSource = new MatTableDataSource<AdminOrder>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  loading = true;
  statusFilter = '';

  private adminOrdersService = inject(AdminOrdersService);
  private dialog = inject(MatDialog);
  private snackBar = inject(SnackbarService);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.adminOrdersService.getOrders({
      page: this.currentPage,
      size: this.pageSize,
      status: this.statusFilter ? this.statusFilter : undefined
    }).subscribe({
      next: (response: any) => {
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading orders', error);
        this.snackBar.error('Failed to load orders');
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status === 'ALL' ? '' : status;
    this.currentPage = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadOrders();
  }

  viewOrderDetails(order: AdminOrder): void {
    this.dialog.open(OrderDetailsDialogComponent, {
      width: '700px',
      data: { orderId: order.orderId }
    });
  }

  cancelOrder(order: AdminOrder): void {
    const dialogRef = this.dialog.open(AdminCancelOrderDialogComponent, {
      width: '500px',
      data: { orderId: order.orderId }
    });

    dialogRef.afterClosed().subscribe(reason => {
      if (reason) {
        this.adminOrdersService.cancelOrder(order.orderId, reason).subscribe({
          next: () => {
            this.snackBar.success('Order cancelled successfully');
            this.loadOrders();
          },
          error: (error: any) => {
            console.error('Error cancelling order', error);
            this.snackBar.error('Failed to cancel order');
          }
        });
      }
    });
  }

  getStatusClass(status: string): string {
    if (!status) return '';
    const s = status.toUpperCase();
    switch (s) {
      case 'PENDING_PAYMENT': return 'status-pending';
      case 'PAYMENT_FAILED': return 'status-failed';
      case 'CONFIRMED': return 'status-placed';
      case 'PROCESSING': return 'status-processing';
      case 'SHIPPED': return 'status-shipped';
      case 'OUT_FOR_DELIVERY': return 'status-out-for-delivery';
      case 'DELIVERED': return 'status-delivered';
      case 'DELIVERY_FAILED': return 'status-failed';
      case 'CANCELLED': return 'status-cancelled';
      case 'RETURNED': return 'status-returned';
      default: return '';
    }
  }
}

