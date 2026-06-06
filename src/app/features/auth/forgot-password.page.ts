import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
import { PasswordRecoveryResult, PasswordRecoveryService } from './password-recovery.service';

@Component({
  selector: 'app-forgot-password-page',
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
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss'
})
export class ForgotPasswordPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly passwordRecoveryService = inject(PasswordRecoveryService);

  protected readonly isSubmitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly requestError = signal<string | null>(null);
  protected readonly requestResult = signal<PasswordRecoveryResult | null>(null);

  protected readonly recoveryForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  protected submitRequest(): void {
    this.submitted.set(true);
    this.requestError.set(null);

    if (this.recoveryForm.invalid || this.isSubmitting()) {
      this.recoveryForm.markAllAsTouched();
      return;
    }

    const email = this.recoveryForm.getRawValue().email.trim();
    this.isSubmitting.set(true);

    this.passwordRecoveryService.requestResetLink(email).subscribe({
      next: (result) => {
        this.requestResult.set(result);
        this.isSubmitting.set(false);
      },
      error: (error: Error) => {
        this.requestError.set(error.message);
        this.isSubmitting.set(false);
      }
    });
  }

  protected startAnotherRequest(): void {
    this.requestResult.set(null);
    this.requestError.set(null);
    this.submitted.set(false);
    this.recoveryForm.reset({
      email: ''
    });
  }

  protected get emailControl() {
    return this.recoveryForm.controls.email;
  }

  protected showEmailError(): boolean {
    return this.emailControl.invalid && (this.emailControl.touched || this.submitted());
  }
}
