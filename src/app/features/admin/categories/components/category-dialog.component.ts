import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonStyleDirective } from '../../../../shared/directives/button-style.directive';

import { CategoryDTO } from '../../../../core/models/admin-category.model';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ButtonStyleDirective
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">{{ isEditMode ? 'Edit Category' : 'Create New Category' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="dialog-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Category Name</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="categoryForm.get('name')?.hasError('required')">Name is required</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button appButtonStyle="secondary" mat-dialog-close>Cancel</button>
      <button mat-flat-button appButtonStyle="primary" [disabled]="categoryForm.invalid" (click)="onSubmit()">
        {{ isEditMode ? 'Save Changes' : 'Create Category' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      margin-bottom: 0.5rem;
      font-weight: 700;
      color: #111827;
    }
    .dialog-form {
      padding-top: 0.5rem;
      min-width: 300px;
    }
    .full-width {
      width: 100%;
    }
    .dialog-actions {
      padding: 1rem 1.5rem 1.5rem 1.5rem;
    }
  `]
})
export class CategoryDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoryDialogComponent>);
  public data = inject(MAT_DIALOG_DATA) as { category: CategoryDTO | null };

  categoryForm!: FormGroup;
  isEditMode = false;

  ngOnInit() {
    this.isEditMode = !!this.data.category;

    this.categoryForm = this.fb.group({
      name: [this.data.category?.name || '', [Validators.required, Validators.maxLength(100)]]
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.dialogRef.close(this.categoryForm.value);
    }
  }
}
