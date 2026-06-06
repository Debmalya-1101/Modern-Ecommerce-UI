import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { ButtonStyleDirective } from './shared/directives/button-style.directive';

interface NavigationItem {
  label: string;
  path: string;
  description: string;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    ButtonStyleDirective
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly mobileBreakpoint = '(max-width: 768px)';
  private readonly startsOnMobile = this.breakpointObserver.isMatched(this.mobileBreakpoint);
  private readonly currentUrl = signal(this.router.url);

  protected readonly title = 'Modern Commerce';
  protected readonly isMobile = signal(this.startsOnMobile);
  protected readonly isSidebarOpen = signal(!this.startsOnMobile);
  protected readonly authState = this.authService.state;
  protected readonly session = this.authService.session;
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly isAuthRoute = computed(() => {
    const url = this.currentUrl();

    return url.startsWith('/login')
      || url.startsWith('/signup')
      || url.startsWith('/forgot-password')
      || url.startsWith('/reset-password');
  });
  protected readonly isLoginRoute = computed(() => this.currentUrl().startsWith('/login'));
  protected readonly isSignupRoute = computed(() => this.currentUrl().startsWith('/signup'));
  protected readonly currentUserLabel = computed(
    () => this.session().user?.username ?? 'Guest'
  );
  protected readonly navigationItems: NavigationItem[] = [
    {
      label: 'Home',
      path: '/',
      description: 'Feature routing overview'
    },
    {
      label: 'Products',
      path: '/products',
      description: 'Product listing placeholder'
    },
    {
      label: 'Cart',
      path: '/cart',
      description: 'Cart route placeholder'
    },
    {
      label: 'Checkout',
      path: '/checkout',
      description: 'Checkout route placeholder'
    },
    {
      label: 'Orders',
      path: '/orders',
      description: 'Orders route placeholder'
    },
    {
      label: 'Profile',
      path: '/profile',
      description: 'Profile route placeholder'
    }
  ];
  protected readonly plannedAreas = [
    'Product details route',
    'Protected order history',
    'Future admin area'
  ];

  constructor() {
    this.breakpointObserver
      .observe(this.mobileBreakpoint)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ matches }) => {
        this.isMobile.set(matches);
        this.isSidebarOpen.set(!matches);
      });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  protected toggleSidebar(): void {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  protected closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this.isSidebarOpen.set(false);
    }
  }

  protected logout(): void {
    this.authService.logout();
    this.closeSidebarOnMobile();
    this.router.navigateByUrl('/login');
  }
}
