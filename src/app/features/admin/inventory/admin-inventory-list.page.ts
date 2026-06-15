import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { AdminInventoryService } from '../../../core/services/admin-inventory.service';
import { InventoryResponseDTO, InventoryAnalyticsDashboardDTO } from '../../../core/models/admin-inventory.model';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-admin-inventory-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './admin-inventory-list.page.html',
  styleUrls: ['./admin-inventory-list.page.scss']
})
export class AdminInventoryListPage implements OnInit {
  private inventoryService = inject(AdminInventoryService);
  private snackBar = inject(SnackbarService);

  displayedColumns: string[] = ['productName', 'availableQuantity', 'reservedQuantity', 'reorderLevel', 'totalQuantity', 'status', 'actions'];
  dataSource = new MatTableDataSource<InventoryResponseDTO>([]);
  
  totalElements = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);
  isLoadingList = signal(false);
  isLoadingAnalytics = signal(false);

  analytics = signal<InventoryAnalyticsDashboardDTO | null>(null);

  searchControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadAnalytics();
    this.loadInventory();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.pageIndex.set(0);
      this.loadInventory();
    });
  }

  loadAnalytics() {
    this.isLoadingAnalytics.set(true);
    this.inventoryService.getInventoryAnalytics().subscribe({
      next: (res) => {
        this.analytics.set(res);
        this.isLoadingAnalytics.set(false);
      },
      error: () => {
        this.snackBar.error('Failed to load inventory analytics');
        this.isLoadingAnalytics.set(false);
      }
    });
  }

  loadInventory() {
    this.isLoadingList.set(true);
    const searchTerm = this.searchControl.value || '';
    
    // We can parse if it's a number to use as productId, or pass as productName
    const isNumeric = !isNaN(Number(searchTerm)) && searchTerm.trim() !== '';
    const params: any = {
      page: this.pageIndex(),
      size: this.pageSize()
    };
    
    if (searchTerm) {
      if (isNumeric) {
        params.productId = Number(searchTerm);
      } else {
        params.productName = searchTerm;
      }
    }

    this.inventoryService.getInventoryList(params).subscribe({
      next: (res) => {
        this.dataSource.data = res.content;
        this.totalElements.set(res.totalElements);
        this.isLoadingList.set(false);
      },
      error: () => {
        this.snackBar.error('Failed to load inventory list');
        this.isLoadingList.set(false);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadInventory();
  }

  getStockStatus(item: InventoryResponseDTO): 'in-stock' | 'low-stock' | 'out-of-stock' {
    if (item.availableQuantity === 0) return 'out-of-stock';
    if (item.availableQuantity <= item.reorderLevel) return 'low-stock';
    return 'in-stock';
  }
}
