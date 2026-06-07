import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';

import { AdminProductDTO } from '../../../../../core/models/admin-product.model';
import { AdminCategoriesService } from '../../../../../core/services/admin-categories.service';
import { CategoryDTO, AdminAttributeKeyDTO } from '../../../../../core/models/admin-category.model';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">{{ isEditMode ? 'Edit Product' : 'Create New Product' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Product Name</mat-label>
            <input matInput formControlName="name" required>
            <mat-error *ngIf="productForm.get('name')?.hasError('required')">Name is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Brand</mat-label>
            <input matInput formControlName="brand">
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Category</mat-label>
            <mat-select formControlName="categoryId" required (selectionChange)="onCategoryChange($event.value)">
              <mat-option *ngFor="let cat of categories" [value]="cat.id">
                {{ cat.name }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="productForm.get('categoryId')?.hasError('required')">Category is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Status</mat-label>
            <mat-select formControlName="active" required>
              <mat-option [value]="true">Active</mat-option>
              <mat-option [value]="false">Inactive</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        
        <!-- Dynamic Attributes Section -->
        <div class="attributes-section" *ngIf="currentAttributeKeys.length > 0" formGroupName="attributes">
          <h4 class="section-title">Product Specifications</h4>
          <div class="attributes-grid">
            <mat-form-field appearance="outline" *ngFor="let key of currentAttributeKeys">
              <mat-label>{{ key.keyName }}</mat-label>
              <input matInput [formControlName]="key.id" [type]="key.type === 'NUMBER' ? 'number' : 'text'" required>
            </mat-form-field>
          </div>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" required></textarea>
          <mat-error *ngIf="productForm.get('description')?.hasError('required')">Description is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Image URL</mat-label>
          <input matInput formControlName="imageUrl" required>
          <mat-error *ngIf="productForm.get('imageUrl')?.hasError('required')">Image URL is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Additional Image URLs (comma-separated)</mat-label>
          <textarea matInput formControlName="additionalImageUrls" rows="2" placeholder="https://image1.jpg, https://image2.jpg"></textarea>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Price (INR)</mat-label>
            <input matInput type="number" formControlName="price" min="0" required>
            <mat-error *ngIf="productForm.get('price')?.hasError('required')">Price is required</mat-error>
            <mat-error *ngIf="productForm.get('price')?.hasError('min')">Price cannot be negative</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Stock Quantity</mat-label>
            <input matInput type="number" formControlName="stock" min="0" required>
            <mat-error *ngIf="productForm.get('stock')?.hasError('required')">Stock is required</mat-error>
            <mat-error *ngIf="productForm.get('stock')?.hasError('min')">Stock cannot be negative</mat-error>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="productForm.invalid" (click)="onSubmit()">
        {{ isEditMode ? 'Save Changes' : 'Create Product' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      margin-bottom: 0.5rem;
      font-weight: 700;
      color: #111827;
    }
    .product-form {
      padding-top: 0.5rem;
      min-width: 400px;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .form-row {
      display: flex;
      gap: 1.5rem;
    }
    .full-width {
      width: 100%;
    }
    .dialog-actions {
      padding: 1rem 1.5rem 1.5rem 1.5rem;
    }
    .attributes-section {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      margin-bottom: 0.5rem;
    }
    .section-title {
      margin: 0 0 1rem 0;
      font-size: 0.95rem;
      color: #475569;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .attributes-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    
    @media (max-width: 600px) {
      .form-row, .attributes-grid {
        flex-direction: column;
        grid-template-columns: 1fr;
        gap: 0;
      }
      .product-form {
        min-width: 100%;
      }
    }
  `]
})
export class ProductDialogComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private categoriesService = inject(AdminCategoriesService);
  private dialogRef = inject(MatDialogRef<ProductDialogComponent>);
  public data = inject(MAT_DIALOG_DATA) as { product: AdminProductDTO | null };

  productForm!: FormGroup;
  isEditMode = false;
  categories: CategoryDTO[] = [];
  currentAttributeKeys: AdminAttributeKeyDTO[] = [];
  
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.isEditMode = !!this.data.product;

    this.productForm = this.fb.group({
      name: [this.data.product?.name || '', Validators.required],
      brand: [this.data.product?.brand || ''],
      description: [this.data.product?.description || '', Validators.required],
      price: [this.data.product?.price || 0, [Validators.required, Validators.min(0)]],
      imageUrl: [this.data.product?.imageUrl || '', Validators.required],
      categoryId: [this.data.product?.categoryId || null, Validators.required],
      stock: [this.data.product?.stock || 0, [Validators.required, Validators.min(0)]],
      active: [this.data.product?.active ?? true, Validators.required],
      attributes: this.fb.group({}),
      additionalImageUrls: [this.data.product?.imageUrls?.join(',\n') || '']
    });

    this.loadCategories();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(cats => {
      this.categories = cats;
      if (this.data.product?.categoryId) {
        this.onCategoryChange(this.data.product.categoryId, true);
      }
    });
  }

  onCategoryChange(categoryId: number, isInitialLoad = false) {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) return;

    this.currentAttributeKeys = category.attributeKeys;
    const attributesGroup = this.productForm.get('attributes') as FormGroup;
    
    // Clear old controls
    Object.keys(attributesGroup.controls).forEach(key => attributesGroup.removeControl(key));

    // Add new controls
    this.currentAttributeKeys.forEach(key => {
      let initialValue = '';
      if (isInitialLoad && this.data.product?.attributes) {
        const existingAttr = this.data.product.attributes.find(a => a.keyId === key.id);
        if (existingAttr) {
          initialValue = existingAttr.value;
        }
      }
      attributesGroup.addControl(key.id.toString(), this.fb.control(initialValue, Validators.required));
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      
      // Transform attributes from { '1': '8GB' } back to array format [{keyId: 1, value: '8GB'}]
      const attributesArray = [];
      if (formValue.attributes) {
        for (const [keyId, value] of Object.entries(formValue.attributes)) {
          attributesArray.push({
            keyId: Number(keyId),
            value: String(value)
          });
        }
      }
      
      const additionalUrlsString = formValue.additionalImageUrls as string;
      const additionalImageUrls = additionalUrlsString
        ? additionalUrlsString.split(',').map(u => u.trim()).filter(u => u.length > 0)
        : [];
      
      const payload = {
        ...formValue,
        attributes: attributesArray,
        additionalImageUrls
      };
      
      this.dialogRef.close(payload);
    }
  }
}
