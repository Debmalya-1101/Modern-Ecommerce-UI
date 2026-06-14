import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { Address } from '../../../core/models/address.model';
import { ButtonStyleDirective } from '../../../shared/directives/button-style.directive';

export interface AddressDialogData {
  address?: Address;
}

@Component({
  selector: 'app-address-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    ButtonStyleDirective
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss'
})
export class AddressFormComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly dialogRef = inject(MatDialogRef<AddressFormComponent, Address>);
  protected readonly data = inject<AddressDialogData>(MAT_DIALOG_DATA);

  protected readonly isEditMode = !!this.data?.address;
  protected addressForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    const addr = this.data?.address;
    this.addressForm = this.fb.group({
      contactName: [addr?.contactName || '', [Validators.required, Validators.minLength(3)]],
      mobileNumber: [addr?.mobileNumber || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      addressLine: [addr?.addressLine || '', [Validators.required, Validators.minLength(10)]],
      city: [addr?.city || '', [Validators.required]],
      state: [addr?.state || '', [Validators.required]],
      postalCode: [addr?.postalCode || '', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      country: [addr?.country || 'India', [Validators.required]],
      isDefault: [addr?.isDefault || false]
    });
  }

  protected onSubmit(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const formValue = this.addressForm.value;
    const result: Address = {
      ...formValue,
      // Keep ID if editing
      id: this.data?.address?.id
    };

    this.dialogRef.close(result);
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }
}
