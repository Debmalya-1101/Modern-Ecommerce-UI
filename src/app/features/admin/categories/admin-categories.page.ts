import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { AdminCategoriesService } from '../../../core/services/admin-categories.service';
import { CategoryDTO, AdminAttributeKeyDTO } from '../../../core/models/admin-category.model';
import { CategoryDialogComponent } from './components/category-dialog.component';
import { AttributeKeyDialogComponent } from './components/attribute-key-dialog.component';
import { ConfirmDeleteDialogComponent } from '../products/components/confirm-delete-dialog/confirm-delete-dialog.component';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './admin-categories.page.html',
  styleUrls: ['./admin-categories.page.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AdminCategoriesPage implements OnInit {
  private categoriesService = inject(AdminCategoriesService);
  private dialog = inject(MatDialog);
  private snackBar = inject(SnackbarService);

  displayedColumns: string[] = ['name', 'attributesCount', 'actions'];
  dataSource = new MatTableDataSource<CategoryDTO>([]);
  expandedElement: CategoryDTO | null = null;
  
  isLoading = signal(true);

  ngOnInit() {
    this.loadCategories();
  }

  toggleRow(element: CategoryDTO, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const isCollapsing = this.expandedElement === element;
    this.expandedElement = isCollapsing ? null : element;
    
    if (isCollapsing && event && event.currentTarget) {
      setTimeout(() => {
        const target = (event.currentTarget as HTMLElement).closest('tr.element-row');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  }

  loadCategories() {
    this.isLoading.set(true);
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.dataSource.data = categories;
        this.isLoading.set(false);
      },
      error: () => {
        this.showError('Failed to load categories');
        this.isLoading.set(false);
      }
    });
  }

  openCategoryDialog(category?: CategoryDTO) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: { category: category || null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (category) {
          this.categoriesService.updateCategory(category.id, result).subscribe({
            next: () => {
              this.showSuccess('Category updated');
              this.loadCategories();
            },
            error: () => this.showError('Failed to update category')
          });
        } else {
          this.categoriesService.createCategory(result).subscribe({
            next: () => {
              this.showSuccess('Category created');
              this.loadCategories();
            },
            error: () => this.showError('Failed to create category')
          });
        }
      }
    });
  }

  deleteCategory(category: CategoryDTO) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { 
        title: 'Delete Category',
        message: `Are you sure you want to delete "${category.name}"? This action cannot be undone and will fail if products are linked.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.categoriesService.deleteCategory(category.id).subscribe({
          next: () => {
            this.showSuccess('Category deleted');
            this.loadCategories();
          },
          error: (err) => {
            this.showError('Failed to delete category. It might be in use.');
          }
        });
      }
    });
  }

  openAttributeDialog(category: CategoryDTO, key?: AdminAttributeKeyDTO) {
    const dialogRef = this.dialog.open(AttributeKeyDialogComponent, {
      data: { key: key || null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (key) {
          this.categoriesService.updateAttributeKey(key.id, result).subscribe({
            next: () => {
              this.showSuccess('Attribute key updated');
              this.loadCategories();
            },
            error: () => this.showError('Failed to update attribute key')
          });
        } else {
          result.categoryId = category.id;
          this.categoriesService.createAttributeKey(result).subscribe({
            next: () => {
              this.showSuccess('Attribute key added');
              this.loadCategories();
            },
            error: () => this.showError('Failed to add attribute key')
          });
        }
      }
    });
  }

  deleteAttributeKey(key: AdminAttributeKeyDTO) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { 
        title: 'Delete Attribute Key',
        message: `Are you sure you want to delete "${key.keyName}"? This might break products using this attribute.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.categoriesService.deleteAttributeKey(key.id).subscribe({
          next: () => {
            this.showSuccess('Attribute key deleted');
            this.loadCategories();
          },
          error: () => this.showError('Failed to delete attribute key')
        });
      }
    });
  }

  private showSuccess(message: string) {
    this.snackBar.success(message);
  }

  private showError(message: string) {
    this.snackBar.error(message);
  }
}
