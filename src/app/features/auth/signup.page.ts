import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SignupRequest } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-signup-page',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ButtonStyleDirective,
    LoadingSpinnerComponent
  ],
  templateUrl: './signup.page.html',
  styleUrl: './signup.page.scss'
})
export class SignupPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly authState = this.authService.state;
  protected readonly isRestoringSession = computed(
    () => this.authState().isLoading && !this.authState().isReady
  );
  protected readonly isSubmitting = computed(
    () => this.authState().isLoading && this.authState().isReady
  );
  protected readonly submitted = signal(false);

  protected readonly signupForm = this.formBuilder.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    {
      validators: confirmPasswordValidator
    }
  );

  ngOnInit(): void {
    this.authService.clearError();

    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/profile');
    }
  }

  protected submitSignup(): void {
    this.submitted.set(true);

    if (this.signupForm.invalid || this.isSubmitting()) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const formValue = this.signupForm.getRawValue();
    const request: SignupRequest = {
      emailId: formValue.email.trim(),
      userName: formValue.fullName.trim(),
      password: formValue.password
    };

    this.authService.signup(request).subscribe({
      next: () => {
        this.signupForm.reset({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        this.submitted.set(false);
        this.router.navigate(['/login'], {
          queryParams: {
            registered: 'true'
          }
        });
      },
      error: () => {
        this.signupForm.markAllAsTouched();
      }
    });
  }

  protected get fullNameControl() {
    return this.signupForm.controls.fullName;
  }

  protected get emailControl() {
    return this.signupForm.controls.email;
  }

  protected get passwordControl() {
    return this.signupForm.controls.password;
  }

  protected get confirmPasswordControl() {
    return this.signupForm.controls.confirmPassword;
  }

  protected showFieldError(fieldName: 'fullName' | 'email' | 'password' | 'confirmPassword'): boolean {
    const control = this.signupForm.controls[fieldName];

    return control.invalid && (control.touched || this.submitted());
  }

  protected showPasswordMismatch(): boolean {
    return this.signupForm.hasError('passwordMismatch')
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
