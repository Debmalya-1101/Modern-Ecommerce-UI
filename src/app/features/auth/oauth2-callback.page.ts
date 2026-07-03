import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-oauth2-callback',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, LoadingSpinnerComponent],
  template: `
    <section class="login-page auth-page">
      <mat-card class="auth-card auth-card--status" appearance="outlined">
        <app-loading-spinner label="Completing sign in..." [diameter]="52" />
      </mat-card>
    </section>
  `,
  styleUrl: './login.page.scss'
})
export class Oauth2CallbackPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    const error = this.route.snapshot.queryParamMap.get('error');
    if (error) {
      this.router.navigate(['/login'], { queryParams: { error: 'Authentication failed: ' + error } });
      return;
    }

    const accessToken = this.route.snapshot.queryParamMap.get('accessToken');
    const refreshToken = this.route.snapshot.queryParamMap.get('refreshToken');

    if (accessToken && refreshToken) {
      this.authService.setTokensFromOAuth(accessToken, refreshToken);
      
      const role = this.authService.currentRole();
      if (role === 'ROLE_ADMIN') {
        this.router.navigateByUrl('/admin');
      } else if (role === 'ROLE_DELIVERY_PARTNER') {
        this.router.navigateByUrl('/delivery-partner/dashboard');
      } else {
        this.router.navigateByUrl('/');
      }
    } else {
      this.router.navigate(['/login'], { queryParams: { error: 'Invalid authentication response' } });
    }
  }
}
