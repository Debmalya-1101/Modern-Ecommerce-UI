import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface AdminCancelOrderDialogData {
  orderId: number;
}

@Component({
  selector: 'app-admin-cancel-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './admin-cancel-order-dialog.component.html',
  styleUrl: './admin-cancel-order-dialog.component.scss'
})
export class AdminCancelOrderDialogComponent {
  cancelForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AdminCancelOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdminCancelOrderDialogData,
    private fb: FormBuilder
  ) {
    this.cancelForm = this.fb.group({
      reason: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.cancelForm.valid) {
      this.dialogRef.close(this.cancelForm.value.reason);
    }
  }
}
