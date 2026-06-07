import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AdminAttributeKeyDTO } from '../../../../core/models/admin-category.model';

@Component({
  selector: 'app-attribute-key-dialog',
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
    <h2 mat-dialog-title class="dialog-title">{{ isEditMode ? 'Edit Attribute Key' : 'Create Attribute Key' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="attributeForm" (ngSubmit)="onSubmit()" class="dialog-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Key Name (e.g., RAM, Storage)</mat-label>
          <input matInput formControlName="keyName" required>
          <mat-error *ngIf="attributeForm.get('keyName')?.hasError('required')">Key Name is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Input Type</mat-label>
          <mat-select formControlName="type" required>
            <mat-option value="TEXT">Text (e.g., "8GB", "Red")</mat-option>
            <mat-option value="NUMBER">Number (e.g., 4000)</mat-option>
          </mat-select>
          <mat-error *ngIf="attributeForm.get('type')?.hasError('required')">Type is required</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="attributeForm.invalid" (click)="onSubmit()">
        {{ isEditMode ? 'Save Changes' : 'Add Key' }}
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
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .full-width {
      width: 100%;
    }
    .dialog-actions {
      padding: 1rem 1.5rem 1.5rem 1.5rem;
    }
  `]
})
export class AttributeKeyDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AttributeKeyDialogComponent>);
  public data = inject(MAT_DIALOG_DATA) as { key: AdminAttributeKeyDTO | null };

  attributeForm!: FormGroup;
  isEditMode = false;

  ngOnInit() {
    this.isEditMode = !!this.data.key;

    this.attributeForm = this.fb.group({
      keyName: [this.data.key?.keyName || '', [Validators.required, Validators.maxLength(50)]],
      type: [this.data.key?.type || 'TEXT', Validators.required]
    });
  }

  onSubmit() {
    if (this.attributeForm.valid) {
      this.dialogRef.close(this.attributeForm.value);
    }
  }
}
