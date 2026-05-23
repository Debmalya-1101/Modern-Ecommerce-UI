import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
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
  private readonly mobileBreakpoint = '(max-width: 768px)';
  private readonly startsOnMobile = this.breakpointObserver.isMatched(this.mobileBreakpoint);

  protected readonly title = 'Modern Commerce';
  protected readonly isMobile = signal(this.startsOnMobile);
  protected readonly isSidebarOpen = signal(!this.startsOnMobile);
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
  }

  protected toggleSidebar(): void {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  protected closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this.isSidebarOpen.set(false);
    }
  }
}
