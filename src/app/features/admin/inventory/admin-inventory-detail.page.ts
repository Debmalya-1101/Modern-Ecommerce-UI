import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AdminInventoryService } from '../../../core/services/admin-inventory.service';
import { InventoryResponseDTO, InventoryTransactionDTO } from '../../../core/models/admin-inventory.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { AdjustmentDialogComponent } from './components/adjustment-dialog/adjustment-dialog.component';

@Component({
  selector: 'app-admin-inventory-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatTabsModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './admin-inventory-detail.page.html',
  styleUrls: ['./admin-inventory-detail.page.scss']
})
export class AdminInventoryDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private inventoryService = inject(AdminInventoryService);
  private snackBar = inject(SnackbarService);
  private dialog = inject(MatDialog);

  productId = signal<number | null>(null);
  inventory = signal<InventoryResponseDTO | null>(null);
  isLoading = signal(false);

  // Transactions table
  displayedColumns: string[] = ['createdAt', 'transactionType', 'quantity', 'referenceType', 'referenceId', 'notes'];
  dataSource = new MatTableDataSource<InventoryTransactionDTO>([]);
  totalTransactions = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);
  isLoadingTransactions = signal(false);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('productId');
      if (id) {
        this.productId.set(Number(id));
        this.loadInventoryDetails();
      }
    });
  }

  loadInventoryDetails() {
    const pid = this.productId();
    if (!pid) return;

    this.isLoading.set(true);
    this.inventoryService.getInventoryForProduct(pid).subscribe({
      next: (res) => {
        this.inventory.set(res);
        this.isLoading.set(false);
        this.loadTransactions();
      },
      error: () => {
        this.snackBar.error('Failed to load inventory details');
        this.isLoading.set(false);
      }
    });
  }

  loadTransactions() {
    const inv = this.inventory();
    if (!inv) return;

    this.isLoadingTransactions.set(true);
    this.inventoryService.getInventoryTransactions(inv.id, {
      page: this.pageIndex(),
      size: this.pageSize()
    }).subscribe({
      next: (res) => {
        this.dataSource.data = res.content;
        this.totalTransactions.set(res.totalElements);
        this.isLoadingTransactions.set(false);
      },
      error: () => {
        this.snackBar.error('Failed to load transactions');
        this.isLoadingTransactions.set(false);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadTransactions();
  }

  openAdjustmentDialog() {
    const inv = this.inventory();
    if (!inv) return;

    const dialogRef = this.dialog.open(AdjustmentDialogComponent, {
      data: { productName: inv.productName },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(request => {
      if (request) {
        this.inventoryService.adjustInventory(inv.productId, request).subscribe({
          next: (res) => {
            this.inventory.set(res);
            this.snackBar.success('Inventory adjusted successfully');
            this.pageIndex.set(0);
            this.loadTransactions();
          },
          error: (err) => {
            this.snackBar.error(err.error?.message || 'Failed to adjust inventory');
          }
        });
      }
    });
  }

  getTransactionIcon(type: string): string {
    switch (type) {
      case 'RESTOCK': return 'add_circle';
      case 'CONSUME': return 'remove_circle';
      case 'RESERVE': return 'lock';
      case 'RELEASE': return 'lock_open';
      case 'ADJUSTMENT': return 'build';
      default: return 'swap_horiz';
    }
  }

  getTransactionColor(type: string): string {
    switch (type) {
      case 'RESTOCK': return 'text-success';
      case 'CONSUME': return 'text-warn';
      case 'RESERVE': return 'text-accent';
      case 'RELEASE': return 'text-primary';
      case 'ADJUSTMENT': return 'text-info';
      default: return '';
    }
  }

  isAllocation(type: string): boolean {
    return ['RESERVE', 'RELEASE', 'RETURN_DAMAGED'].includes(type);
  }

  getDisplayQuantity(element: InventoryTransactionDTO): number {
    if (this.isAllocation(element.transactionType)) {
      return element.quantity; // Neutral absolute value
    }
    if (element.transactionType === 'CONSUME') {
      return -Math.abs(element.quantity);
    }
    return element.quantity;
  }

  getQuantityClass(element: InventoryTransactionDTO): string {
    if (this.isAllocation(element.transactionType)) {
      return 'qty-neutral';
    }
    const qty = this.getDisplayQuantity(element);
    return qty > 0 ? 'qty-positive' : 'qty-negative';
  }

  getQuantityPrefix(element: InventoryTransactionDTO): string {
    if (this.isAllocation(element.transactionType)) {
      return '';
    }
    const qty = this.getDisplayQuantity(element);
    return qty > 0 ? '+' : '';
  }
}
