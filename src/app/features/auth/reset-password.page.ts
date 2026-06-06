import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';

@Component({
  selector: 'app-reset-password-page',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ButtonStyleDirective
  ],
  templateUrl: './reset-password.page.html',
  styleUrl: './reset-password.page.scss'
})
export class ResetPasswordPage {
  private readonly formBuilder = inject(FormBuilder);

  protected readonly submitted = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly resetSuccess = signal(false);

  protected readonly resetForm = this.formBuilder.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    {
      validators: confirmPasswordValidator
    }
  );

  protected submitReset(): void {
    this.submitted.set(true);

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    // Mock API call delay
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.resetSuccess.set(true);
    }, 1200);
  }

  protected get passwordControl() {
    return this.resetForm.controls.password;
  }

  protected get confirmPasswordControl() {
    return this.resetForm.controls.confirmPassword;
  }

  protected showFieldError(fieldName: 'password' | 'confirmPassword'): boolean {
    const control = this.resetForm.controls[fieldName];
    return control.invalid && (control.touched || this.submitted());
  }

  protected showPasswordMismatch(): boolean {
    return this.resetForm.hasError('passwordMismatch')
      && (this.confirmPasswordControl.touched || this.submitted());
  }
}

function confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}
