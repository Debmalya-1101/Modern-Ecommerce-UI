import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services/auth.service';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../../core/config/api-endpoints.constants';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ButtonStyleDirective,
    LoadingSpinnerComponent
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly authState = this.authService.state;
  protected readonly isRestoringSession = computed(
    () => this.authState().isLoading && !this.authState().isReady
  );
  protected readonly isSubmitting = computed(
    () => this.authState().isLoading && this.authState().isReady
  );
  protected readonly signupSuccess = signal(false);
  protected readonly submitted = signal(false);
  protected readonly hidePassword = signal(true);

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    usernameOrEmail: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [true]
  });

  ngOnInit(): void {
    this.authService.clearError();
    this.signupSuccess.set(this.route.snapshot.queryParamMap.get('registered') === 'true');

    if (this.authService.isAuthenticated()) {
      this.navigateAfterLogin();
    }
  }

  protected submitLogin(): void {
    this.submitted.set(true);

    if (this.loginForm.invalid || this.isSubmitting()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { rememberMe, ...request } = this.loginForm.getRawValue();

    this.authService.login(request, rememberMe).subscribe({
      next: () => {
        this.loginForm.reset({
          usernameOrEmail: '',
          password: '',
          rememberMe: true
        });
        this.submitted.set(false);
        this.navigateAfterLogin();
      },
      error: () => {
        this.loginForm.markAllAsTouched();
      }
    });
  }

  protected get usernameOrEmailControl() {
    return this.loginForm.controls.usernameOrEmail;
  }

  protected get passwordControl() {
    return this.loginForm.controls.password;
  }

  protected showFieldError(fieldName: 'usernameOrEmail' | 'password'): boolean {
    const control = this.loginForm.controls[fieldName];

    return control.invalid && (control.touched || this.submitted());
  }

  protected loginWithGoogle(): void {
    window.location.href = `${environment.apiBaseUrl}${API_ENDPOINTS.oauth2.google}`;
  }

  protected loginWithFacebook(): void {
    window.location.href = `${environment.apiBaseUrl}${API_ENDPOINTS.oauth2.facebook}`;
  }

  private navigateAfterLogin(): void {
    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
    
    // Honor specific redirect if present
    if (redirectTo && redirectTo.startsWith('/')) {
      this.router.navigateByUrl(redirectTo);
      return;
    }

    // Default routing based on role
    const role = this.authService.currentRole();
    if (role === 'ROLE_ADMIN') {
      this.router.navigateByUrl('/admin');
    } else if (role === 'ROLE_DELIVERY_PARTNER') {
      this.router.navigateByUrl('/delivery-partner/dashboard');
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
