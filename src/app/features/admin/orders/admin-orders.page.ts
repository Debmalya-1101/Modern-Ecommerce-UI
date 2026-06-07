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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';

import { AdminOrder } from '../../../core/models/admin-order.model';
import { AdminOrdersService } from '../../../core/services/admin-orders.service';
import { OrderDetailsDialogComponent } from './components/order-details-dialog/order-details-dialog.component';
import { OrderConfirmDialogComponent } from './components/order-confirm-dialog/order-confirm-dialog.component';

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
    MatSnackBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatCardModule,
    CurrencyPipe,
    DatePipe
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
  private snackBar = inject(MatSnackBar);

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
        this.snackBar.open('Failed to load orders', 'Close', { duration: 3000 });
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

  updateOrderStatus(order: AdminOrder, newStatus: 'PLACED' | 'SHIPPED' | 'DELIVERED'): void {
    if (order.status === newStatus) return;

    const dialogRef = this.dialog.open(OrderConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Status Update',
        message: `Are you sure you want to update the status of order #${order.orderId} to ${newStatus}?`,
        confirmText: 'Update Status',
        cancelText: 'Cancel',
        color: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminOrdersService.updateOrderStatus(order.orderId, newStatus).subscribe({
          next: () => {
            this.snackBar.open('Order status updated successfully', 'Close', { duration: 3000 });
            this.loadOrders();
          },
          error: (error: any) => {
            console.error('Error updating order status', error);
            this.snackBar.open('Failed to update order status', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PLACED': return 'status-placed';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  getAvailableStatusTransitions(currentStatus: string): ('PLACED' | 'SHIPPED' | 'DELIVERED')[] {
    if (currentStatus === 'PLACED') return ['SHIPPED', 'DELIVERED'];
    if (currentStatus === 'SHIPPED') return ['DELIVERED'];
    return [];
  }
}

