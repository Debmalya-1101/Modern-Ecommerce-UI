import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { Subject, takeUntil, finalize } from 'rxjs';
import { ButtonStyleDirective } from '../../../../../shared/directives/button-style.directive';

import { AdminProductDTO } from '../../../../../core/models/admin-product.model';
import { AdminCategoriesService } from '../../../../../core/services/admin-categories.service';
import { AdminProductsService } from '../../../../../core/services/admin-products.service';
import { CategoryDTO, AdminAttributeKeyDTO } from '../../../../../core/models/admin-category.model';

type ScrapeMode = 'manual' | 'amazon' | 'flipkart';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatRadioModule,
    ButtonStyleDirective
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title class="dialog-title">{{ isEditMode ? 'Edit Product' : 'Create New Product' }}</h2>
      
      <div class="mode-selector" *ngIf="!isEditMode">
        <mat-button-toggle-group [(ngModel)]="scrapeMode" aria-label="Creation Mode" class="modern-toggle-group">
          <mat-button-toggle value="manual">Manual Entry</mat-button-toggle>
          <mat-button-toggle value="amazon">Amazon Import</mat-button-toggle>
          <mat-button-toggle value="flipkart">Flipkart Import</mat-button-toggle>
        </mat-button-toggle-group>
      </div>
    </div>

    <mat-dialog-content class="dialog-content-wrapper">
      
      <!-- LOADING OVERLAY -->
      <div class="loading-overlay" *ngIf="isScraping">
        <div class="loading-card">
          <mat-spinner diameter="40"></mat-spinner>
          <h3>Scraping Product Data...</h3>
          <p>Please wait while we import the product details.</p>
          <button mat-stroked-button color="primary" (click)="onRunInBackground()">Run in Background</button>
        </div>
      </div>

      <!-- MANUAL FORM -->
      <form *ngIf="scrapeMode === 'manual'" [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
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

      <!-- SCRAPE FORM -->
      <form *ngIf="scrapeMode !== 'manual'" [formGroup]="scrapeForm" class="product-form scrape-form">
        <div class="info-alert">
          <mat-icon>info</mat-icon>
          <p>
            Enter {{ scrapeMode === 'amazon' ? 'Amazon ASINs' : 'Flipkart FSNs' }} separated by commas. 
            The system will simulate requests to scrape product details, images, and pricing.
          </p>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ scrapeMode === 'amazon' ? 'ASIN(s)' : 'FSN(s)' }}</mat-label>
          <input matInput formControlName="ids" [placeholder]="scrapeMode === 'amazon' ? 'e.g. B09G93C5DK, B0BZM6985C' : 'e.g. MOBGTAGMG5GB3BD3'" required>
          <mat-error *ngIf="scrapeForm.get('ids')?.hasError('required')">Product IDs are required</mat-error>
        </mat-form-field>

        <div class="category-selection-area">
          <mat-radio-group formControlName="categorySource" class="category-radio-group">
            <mat-radio-button value="existing">Use Existing Category</mat-radio-button>
            <mat-radio-button value="new">Create New Category</mat-radio-button>
          </mat-radio-group>

          <mat-form-field *ngIf="scrapeForm.get('categorySource')?.value === 'existing'" appearance="outline" class="full-width">
            <mat-label>Select Category</mat-label>
            <mat-select formControlName="existingCategoryId">
              <mat-option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</mat-option>
            </mat-select>
            <mat-error *ngIf="scrapeForm.get('existingCategoryId')?.hasError('required')">Please select a category</mat-error>
          </mat-form-field>

          <mat-form-field *ngIf="scrapeForm.get('categorySource')?.value === 'new'" appearance="outline" class="full-width">
            <mat-label>New Category Name</mat-label>
            <input matInput formControlName="newCategoryName" placeholder="e.g. Wearables">
            <mat-error *ngIf="scrapeForm.get('newCategoryName')?.hasError('required')">Category name is required</mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Simulated Reviews</mat-label>
            <input matInput type="number" formControlName="simulatedReviews" min="0">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Simulated Orders</mat-label>
            <input matInput type="number" formControlName="simulatedOrders" min="0">
          </mat-form-field>
        </div>
      </form>

    </mat-dialog-content>
    
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button appButtonStyle="secondary" mat-dialog-close [disabled]="isScraping">Cancel</button>
      
      <button *ngIf="scrapeMode === 'manual'" mat-flat-button appButtonStyle="primary" [disabled]="productForm.invalid || isScraping" (click)="onSubmit()">
        {{ isEditMode ? 'Save Changes' : 'Create Product' }}
      </button>

      <button *ngIf="scrapeMode !== 'manual'" mat-flat-button appButtonStyle="primary" [disabled]="scrapeForm.invalid || isScraping" (click)="onScrapeSubmit()">
        <mat-icon>cloud_download</mat-icon>
        Import Product(s)
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      padding: 1.5rem 1.5rem 0.5rem 1.5rem;
    }
    .dialog-title {
      margin: 0;
      font-weight: 700;
      color: #111827;
      margin-bottom: 1rem;
    }
    .mode-selector {
      margin-bottom: 0.5rem;
      display: flex;
      justify-content: center;
    }
    .modern-toggle-group {
      border-radius: var(--border-radius-sm);
      overflow: hidden;
    }
    .dialog-content-wrapper {
      position: relative;
    }
    .product-form {
      padding-top: 0.5rem;
      min-width: 400px;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .scrape-form {
      gap: 1rem;
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
      border-radius: var(--border-radius-sm);
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
    
    /* Scraper UI */
    .info-alert {
      display: flex;
      gap: 0.75rem;
      background: #e0f2fe;
      color: #0369a1;
      padding: 1rem;
      border-radius: var(--border-radius-sm);
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    .info-alert p {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    .category-selection-area {
      background: #f8fafc;
      padding: 1rem;
      border-radius: var(--border-radius-sm);
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .category-radio-group {
      display: flex;
      gap: 1.5rem;
    }

    /* Loading Overlay */
    .loading-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(4px);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--border-radius-xs);
    }
    .loading-card {
      background: white;
      padding: 2rem;
      border-radius: var(--border-radius-md);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
      max-width: 80%;
    }
    .loading-card h3 {
      margin: 0;
      color: #1e293b;
      font-weight: 600;
    }
    .loading-card p {
      margin: 0;
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
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
  private adminProductsService = inject(AdminProductsService);
  private dialogRef = inject(MatDialogRef<ProductDialogComponent>);
  public data = inject(MAT_DIALOG_DATA) as { product: AdminProductDTO | null };

  productForm!: FormGroup;
  scrapeForm!: FormGroup;
  
  isEditMode = false;
  categories: CategoryDTO[] = [];
  currentAttributeKeys: AdminAttributeKeyDTO[] = [];
  
  scrapeMode: ScrapeMode = 'manual';
  isScraping = false;
  
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.isEditMode = !!this.data.product;

    // Manual Product Form
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
      additionalImageUrls: [this.data.product?.imageUrls?.join(',\\n') || '']
    });

    // Scrape Settings Form
    this.scrapeForm = this.fb.group({
      ids: ['', Validators.required],
      categorySource: ['existing', Validators.required],
      existingCategoryId: [null],
      newCategoryName: [''],
      simulatedReviews: [3],
      simulatedOrders: [5]
    });

    // Validation sync for Category Selection
    this.scrapeForm.get('categorySource')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(source => {
      const existingCtrl = this.scrapeForm.get('existingCategoryId');
      const newCtrl = this.scrapeForm.get('newCategoryName');
      
      if (source === 'existing') {
        existingCtrl?.setValidators([Validators.required]);
        newCtrl?.clearValidators();
      } else {
        existingCtrl?.clearValidators();
        newCtrl?.setValidators([Validators.required]);
      }
      existingCtrl?.updateValueAndValidity();
      newCtrl?.updateValueAndValidity();
    });
    
    // Trigger initial validation
    this.scrapeForm.get('categorySource')?.setValue('existing');

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
    
    Object.keys(attributesGroup.controls).forEach(key => attributesGroup.removeControl(key));

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
    if (this.productForm.valid && this.scrapeMode === 'manual') {
      const formValue = this.productForm.value;
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
        additionalImageUrls,
        isManual: true
      };
      
      this.dialogRef.close(payload);
    }
  }

  getScrapeCategoryName(): string {
    const formValue = this.scrapeForm.value;
    if (formValue.categorySource === 'existing') {
      const cat = this.categories.find(c => c.id === formValue.existingCategoryId);
      return cat ? cat.name : 'Uncategorized';
    }
    return formValue.newCategoryName;
  }

  getScrapeIdsList(): string[] {
    const idsString = this.scrapeForm.value.ids as string;
    return idsString.split(',').map(id => id.trim()).filter(id => id.length > 0);
  }

  onScrapeSubmit() {
    if (this.scrapeForm.invalid) return;

    this.isScraping = true;
    
    const request = {
      categoryName: this.getScrapeCategoryName(),
      simulatedReviews: this.scrapeForm.value.simulatedReviews,
      simulatedOrders: this.scrapeForm.value.simulatedOrders
    };

    if (this.scrapeMode === 'amazon') {
      const amazonRequest = { ...request, asins: this.getScrapeIdsList() };
      this.adminProductsService.scrapeAmazon(amazonRequest, false)
        .pipe(finalize(() => this.isScraping = false))
        .subscribe({
          next: () => this.dialogRef.close({ scraped: true }),
          error: () => { /* Handled in service/UI */ }
        });
    } else if (this.scrapeMode === 'flipkart') {
      const flipkartRequest = { ...request, fsns: this.getScrapeIdsList() };
      this.adminProductsService.scrapeFlipkart(flipkartRequest, false)
        .pipe(finalize(() => this.isScraping = false))
        .subscribe({
          next: () => this.dialogRef.close({ scraped: true }),
          error: () => { /* Handled in service/UI */ }
        });
    }
  }

  onRunInBackground() {
    if (this.scrapeForm.invalid) return;
    
    const request = {
      categoryName: this.getScrapeCategoryName(),
      simulatedReviews: this.scrapeForm.value.simulatedReviews,
      simulatedOrders: this.scrapeForm.value.simulatedOrders
    };

    if (this.scrapeMode === 'amazon') {
      const amazonRequest = { ...request, asins: this.getScrapeIdsList() };
      this.adminProductsService.scrapeAmazon(amazonRequest, true);
    } else if (this.scrapeMode === 'flipkart') {
      const flipkartRequest = { ...request, fsns: this.getScrapeIdsList() };
      this.adminProductsService.scrapeFlipkart(flipkartRequest, true);
    }
    
    this.dialogRef.close();
  }
}
