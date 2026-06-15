import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '../../core/services/auth.service';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';

interface AdminNavigationItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    ButtonStyleDirective
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private readonly mobileBreakpoint = '(max-width: 768px)';
  
  protected readonly isMobile = signal(this.breakpointObserver.isMatched(this.mobileBreakpoint));
  protected readonly isSidebarOpen = signal(false);
  protected readonly currentUrl = signal(this.router.url);

  protected readonly currentUserLabel = computed(() => this.authService.session().user?.username ?? 'Admin');
  protected readonly currentRole = computed(() => this.authService.session().user?.role ?? 'ROLE_ADMIN');

  protected readonly navigationItems: AdminNavigationItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Orders', path: '/admin/orders', icon: 'shopping_cart' },
    { label: 'Products', path: '/admin/products', icon: 'inventory_2' },
    { label: 'Inventory', path: '/admin/inventory', icon: 'warehouse' },
    { label: 'Categories', path: '/admin/categories', icon: 'category' },
    { label: 'Analytics', path: '/admin/analytics', icon: 'bar_chart' }
  ];

  constructor() {
    this.breakpointObserver
      .observe(this.mobileBreakpoint)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ matches }) => {
        this.isMobile.set(matches);
        if (!matches) {
          this.isSidebarOpen.set(false);
        }
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
    this.router.navigateByUrl('/login');
  }
}
