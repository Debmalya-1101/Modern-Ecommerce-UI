import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { DeliveryAuthService } from '../../../../core/services/delivery-auth.service';
import { DeliveryPartnerSignupRequest, VehicleType, IdType } from '../../../../core/models/delivery-partner.model';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-dp-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './dp-signup.html',
  styleUrls: ['./dp-signup.scss']
})
export class DpSignupComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly deliveryAuthService = inject(DeliveryAuthService);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);

  protected readonly isSubmitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly error = signal<string | null>(null);

  private idTypeSub?: Subscription;

  readonly vehicleTypes = Object.values(VehicleType);
  readonly idTypes = Object.values(IdType);

  protected readonly signupForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    dateOfBirth: ['', [Validators.required]],
    address: ['', [Validators.required]],
    vehicleType: [VehicleType.BIKE, [Validators.required]],
    vehicleNumber: ['', [Validators.required, Validators.pattern('^[A-Z0-9 ]{6,15}$')]],
    idType: [IdType.AADHAAR, [Validators.required]],
    idNumber: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]]
  });

  ngOnInit(): void {
    // Dynamically update idNumber validators based on idType selection
    this.idTypeSub = this.signupForm.get('idType')?.valueChanges.subscribe((type) => {
      const idControl = this.signupForm.get('idNumber');
      if (!idControl) return;

      idControl.clearValidators();
      
      switch (type) {
        case IdType.AADHAAR:
          idControl.setValidators([Validators.required, Validators.pattern('^[0-9]{12}$')]);
          break;
        case IdType.PAN:
          idControl.setValidators([Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]);
          break;
        case IdType.DRIVING_LICENSE:
        case IdType.VOTER_ID:
        case IdType.PASSPORT:
        default:
          idControl.setValidators([Validators.required, Validators.pattern('^[A-Z0-9]{8,15}$')]);
          break;
      }
      
      idControl.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    if (this.idTypeSub) {
      this.idTypeSub.unsubscribe();
    }
  }

  protected submitSignup(): void {
    this.submitted.set(true);
    this.error.set(null);

    if (this.signupForm.invalid || this.isSubmitting()) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const request: DeliveryPartnerSignupRequest = this.signupForm.getRawValue();

    this.deliveryAuthService.signup(request).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitted.set(false);
        this.snackbarService.success('Registration successful. Your account is pending admin approval.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        // Backend returns plain text for error messages (not JSON), so err.error is the string directly
        const message = typeof err.error === 'string' && err.error
          ? err.error
          : (err.error?.message ?? 'Failed to register. Please try again.');
        this.error.set(message);
        this.signupForm.markAllAsTouched();
      }
    });
  }

  protected showFieldError(fieldName: string): boolean {
    const control = this.signupForm.get(fieldName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  protected getControl(fieldName: string) {
    return this.signupForm.get(fieldName);
  }
}
