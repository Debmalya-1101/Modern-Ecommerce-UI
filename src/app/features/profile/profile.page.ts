import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent,
    ButtonStyleDirective
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly user = computed(() => this.authService.session().user);

  ngOnInit(): void {
    this.loadProfile();
  }

  protected loadProfile(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.authService.refreshCurrentUser().subscribe({
      next: (user) => {
        this.isLoading.set(false);
        if (!user) {
          this.error.set('Failed to load user profile information.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err.message || 'An error occurred while loading profile.');
      }
    });
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  protected formatRole(role?: string): string {
    if (!role) return 'N/A';
    if (role === 'ROLE_ADMIN') return 'Administrator';
    if (role === 'ROLE_USER') return 'Customer';
    return role;
  }
}
