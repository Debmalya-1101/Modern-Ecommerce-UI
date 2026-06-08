import { Component, OnInit, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

import { AdminProductsService } from '../../../core/services/admin-products.service';
import { AdminProductDTO } from '../../../core/models/admin-product.model';
import { ConfirmDeleteDialogComponent } from './components/confirm-delete-dialog/confirm-delete-dialog.component';
import { StockDialogComponent } from './components/stock-dialog/stock-dialog.component';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './admin-products.page.html',
  styleUrls: ['./admin-products.page.scss']
})
export class AdminProductsPage implements OnInit {
  private productsService = inject(AdminProductsService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  
  private importSub?: Subscription;

  displayedColumns: string[] = ['imageUrl', 'name', 'categoryName', 'price', 'stock', 'active', 'actions'];
  dataSource = new MatTableDataSource<AdminProductDTO>([]);
  
  totalElements = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);
  isLoading = signal(false);

  searchControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadProducts();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.pageIndex.set(0);
      this.loadProducts();
    });

    this.importSub = this.productsService.productImported$.subscribe(() => {
      this.loadProducts();
    });
  }

  ngOnDestroy() {
    this.importSub?.unsubscribe();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productsService.getProducts(this.pageIndex(), this.pageSize(), this.searchControl.value || '')
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.content;
          this.totalElements.set(res.totalElements);
          this.isLoading.set(false);
        },
        error: () => {
          this.showError('Failed to load products');
          this.isLoading.set(false);
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProducts();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: { product: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.isManual) {
          this.productsService.createProduct(result).subscribe({
            next: () => {
              this.showSuccess('Product created successfully');
              this.loadProducts();
            },
            error: () => this.showError('Failed to create product')
          });
        } else if (result.scraped) {
          this.loadProducts(); // Scraped successfully and waited
        }
      }
    });
  }

  openEditDialog(product: AdminProductDTO) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: { product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productsService.updateProduct(product.id, result).subscribe({
          next: () => {
            this.showSuccess('Product updated successfully');
            this.loadProducts();
          },
          error: () => this.showError('Failed to update product')
        });
      }
    });
  }

  openStockDialog(product: AdminProductDTO) {
    const dialogRef = this.dialog.open(StockDialogComponent, {
      data: { currentStock: product.stock }
    });

    dialogRef.afterClosed().subscribe(quantity => {
      if (quantity !== undefined) {
        this.productsService.updateStock(product.id, quantity).subscribe({
          next: () => {
            this.showSuccess('Stock updated successfully');
            this.loadProducts();
          },
          error: () => this.showError('Failed to update stock')
        });
      }
    });
  }

  toggleStatus(product: AdminProductDTO) {
    const newStatus = !product.active;
    this.productsService.updateStatus(product.id, newStatus).subscribe({
      next: () => {
        this.showSuccess(`Product marked as ${newStatus ? 'ACTIVE' : 'INACTIVE'}`);
        this.loadProducts();
      },
      error: () => this.showError('Failed to update status')
    });
  }

  deleteProduct(product: AdminProductDTO) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        title: 'Delete Product',
        message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.productsService.deleteProduct(product.id).subscribe({
          next: () => {
            this.showSuccess('Product deleted successfully');
            this.loadProducts();
          },
          error: () => this.showError('Failed to delete product')
        });
      }
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }
}
