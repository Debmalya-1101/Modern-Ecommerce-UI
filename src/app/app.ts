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
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { CartService } from './core/services/cart.service';
import { WishlistService } from './core/services/wishlist.service';
import { ButtonStyleDirective } from './shared/directives/button-style.directive';
import { CartDrawerComponent } from './features/cart/components/cart-drawer/cart-drawer.component';
import { ColdStartBannerComponent } from './shared/components/cold-start-banner/cold-start-banner.component';
import { ColdStartService } from './core/services/cold-start.service';

interface NavigationItem {
  label: string;
  path: string;
  description: string;
  icon: string;
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
    MatBadgeModule,
    MatIconModule,
    MatMenuModule,
    ButtonStyleDirective,
    CartDrawerComponent,
    ColdStartBannerComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  protected readonly coldStartService = inject(ColdStartService);
  private readonly mobileBreakpoint = '(max-width: 768px)';
  private readonly startsOnMobile = this.breakpointObserver.isMatched(this.mobileBreakpoint);
  protected readonly currentUrl = signal(this.router.url);

  protected readonly title = 'Nexis Store';
  protected readonly isMobile = signal(this.startsOnMobile);
  protected readonly isSidebarOpen = signal(false); // Start with sidebar closed
  protected readonly searchQuery = signal(''); // Header search text
  protected readonly isSearchOpen = signal(false); // Mobile search toggle
  
  // Pull to refresh state
  protected readonly isPulling = signal(false);
  protected readonly pullDistance = signal(0);
  protected readonly isRefreshing = signal(false);
  private touchStartY = 0;
  private touchStartX = 0;
  private isHorizontalScroll = false;
  private readonly PULL_THRESHOLD = 70;
  // Tracks whether the touch started inside a nested scrollable child,
  // and what its scrollTop was at touch start — used to abort pull-to-refresh
  // when the inner card handles the gesture itself.
  private innerScrollEl: HTMLElement | null = null;
  private innerScrollTopAtStart = 0;
  protected readonly authState = this.authService.state;
  protected readonly session = this.authService.session;
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly isAuthRoute = computed(() => {
    const url = this.currentUrl();

    return url.startsWith('/login')
      || url.startsWith('/signup')
      || url.startsWith('/forgot-password')
      || url.startsWith('/reset-password')
      || url.startsWith('/delivery-partner/signup');
  });
  protected readonly isAdminRoute = computed(() => this.currentUrl().startsWith('/admin'));
  protected readonly isLoginRoute = computed(() => this.currentUrl().startsWith('/login'));
  protected readonly isSignupRoute = computed(() => 
    this.currentUrl().startsWith('/signup') || this.currentUrl().startsWith('/delivery-partner/signup')
  );
  protected readonly isAdmin = computed(
    () => this.isAuthenticated() && this.session().user?.role === 'ROLE_ADMIN'
  );
  protected readonly isDeliveryPartner = computed(
    () => this.isAuthenticated() && this.session().user?.role === 'ROLE_DELIVERY_PARTNER'
  );
  protected readonly currentUserLabel = computed(
    () => this.session().user?.username ?? 'Guest'
  );
  protected readonly cartItemCount = this.cartService.itemCount;
  protected readonly wishlistItemCount = this.wishlistService.itemCount;
  protected readonly isCartDrawerOpen = this.cartService.isDrawerOpen;
  protected readonly navigationItems: NavigationItem[] = [
    {
      label: 'Home',
      path: '/',
      description: 'Back to the storefront home',
      icon: 'home'
    },
    {
      label: 'Products',
      path: '/products',
      description: 'Browse the product catalog',
      icon: 'shopping_bag'
    },
    {
      label: 'Wishlist',
      path: '/wishlist',
      description: 'Your saved items',
      icon: 'favorite'
    },
    {
      label: 'Cart',
      path: '/cart',
      description: 'View your shopping cart',
      icon: 'shopping_cart'
    },
    {
      label: 'Orders',
      path: '/orders',
      description: 'Your order history',
      icon: 'receipt_long'
    }
  ];

  protected readonly filteredNavigationItems = computed(() => {
    const items = [...this.navigationItems];
    if (this.isAuthenticated()) {
      if (this.authService.hasRole('ROLE_ADMIN')) {
        items.push({
          label: 'Admin Panel',
          path: '/admin',
          description: 'Manage products and orders',
          icon: 'admin_panel_settings'
        });
      }
      if (this.authService.hasRole('ROLE_DELIVERY_PARTNER')) {
        items.push({
          label: 'Partner Dashboard',
          path: '/delivery-partner/dashboard',
          description: 'Manage your deliveries',
          icon: 'local_shipping'
        });
      }
    }
    return items;
  });

  constructor() {
    this.breakpointObserver
      .observe(this.mobileBreakpoint)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ matches }) => {
        this.isMobile.set(matches);
        this.isSidebarOpen.set(false); // Always close on screen transitions
      });

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        const url = event.urlAfterRedirects;
        this.currentUrl.set(url);

        // Sync header search bar with router query params
        const urlTree = this.router.parseUrl(url);
        this.searchQuery.set(urlTree.queryParams['q'] || '');

        // Fix scroll restoration issue: manually scroll main layout containers to top on route change
        setTimeout(() => {
          const scrollContainers = document.querySelectorAll('.shell-content, .shell-main, .admin-shell, .mat-drawer-content');
          scrollContainers.forEach(el => {
            if (el.scrollTo) {
              el.scrollTo(0, 0);
            } else {
              el.scrollTop = 0;
            }
          });
          window.scrollTo(0, 0);
        }, 0);
      });
  }

  protected toggleSidebar(): void {
    this.isSidebarOpen.update((isOpen) => !isOpen);
  }

  protected toggleSearch(): void {
    this.isSearchOpen.update((open) => !open);
  }

  protected closeSearch(): void {
    this.isSearchOpen.set(false);
  }

  protected closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this.isSidebarOpen.set(false);
    }
  }

  protected toggleCartDrawer(event: Event): void {
    if (!this.isMobile()) {
      event.preventDefault();
      this.cartService.toggleDrawer();
    }
  }

  protected closeCartDrawer(): void {
    this.cartService.closeDrawer();
  }

  protected onSearch(event: Event, value: string): void {
    event.preventDefault();
    const q = value.trim();
    this.router.navigate(['/products'], {
      queryParams: { q: q || null }
    });
  }

  protected onSearchInput(value: string): void {
    this.searchQuery.set(value);
  }

  protected clearSearch(inputEl: HTMLInputElement): void {
    this.searchQuery.set('');
    inputEl.value = '';
    this.router.navigate(['/products'], {
      queryParams: { q: null }
    });
  }

  protected logout(): void {
    this.authService.logout();
    this.closeSidebarOnMobile();
    this.router.navigateByUrl('/login');
  }

  /**
   * Walks up the DOM from the touch target to find the nearest scrollable
   * ancestor (excluding the shell container itself). Returns the element
   * if found, or null. Used to detect whether a gesture originated inside
   * a nested scrollable card/list.
   */
  private findInnerScrollable(target: EventTarget | null, shellEl: HTMLElement): HTMLElement | null {
    let el = target as HTMLElement | null;
    while (el && el !== shellEl) {
      const overflowY = window.getComputedStyle(el).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  protected onTouchStart(event: TouchEvent): void {
    if (!this.isMobile() || this.isRefreshing()) return;
    const contentEl = event.currentTarget as HTMLElement;

    // Record any inner scrollable the touch landed on so onTouchMove can
    // abort pull-to-refresh if that element handles the gesture.
    this.innerScrollEl = this.findInnerScrollable(event.target, contentEl);
    this.innerScrollTopAtStart = this.innerScrollEl?.scrollTop ?? 0;

    // Only arm pull-to-refresh when the shell is at the very top AND the
    // touch did NOT start inside a nested scrollable that already has
    // content scrolled above the current position.
    if (contentEl.scrollTop <= 0 && !(this.innerScrollEl && this.innerScrollTopAtStart > 0)) {
      this.touchStartY = event.touches[0].clientY;
      this.touchStartX = event.touches[0].clientX;
      this.isHorizontalScroll = false;
      this.isPulling.set(true);
    }
  }

  protected onTouchMove(event: TouchEvent): void {
    if (!this.isPulling() || this.isRefreshing()) return;

    const contentEl = event.currentTarget as HTMLElement;
    const touchY = event.touches[0].clientY;
    const touchX = event.touches[0].clientX;
    const distanceY = touchY - this.touchStartY;
    const distanceX = Math.abs(touchX - this.touchStartX);

    if (this.isHorizontalScroll) {
      return;
    }

    // Abort if the inner scrollable element has moved since touch started —
    // it consumed the gesture, so do not trigger pull-to-refresh.
    if (this.innerScrollEl && this.innerScrollEl.scrollTop !== this.innerScrollTopAtStart) {
      this.isPulling.set(false);
      this.pullDistance.set(0);
      return;
    }

    // Also abort if the finger is dragging downward (scroll-up gesture) while
    // inside a scrollable child that is currently at its top — the child will
    // handle any subsequent upward movement once it has content to scroll.
    if (this.innerScrollEl && distanceY > 0) {
      this.isPulling.set(false);
      this.pullDistance.set(0);
      return;
    }

    // Determine if the user is scrolling horizontally (e.g. swiping a carousel)
    if (distanceX > Math.abs(distanceY)) {
      this.isHorizontalScroll = true;
      this.isPulling.set(false);
      this.pullDistance.set(0);
      return;
    }

    if (distanceY > 0 && contentEl.scrollTop <= 0) {
      this.pullDistance.set(Math.min(distanceY * 0.45, this.PULL_THRESHOLD + 20));
      if (event.cancelable) {
        event.preventDefault();
      }
    } else {
      this.isPulling.set(false);
      this.pullDistance.set(0);
    }
  }

  protected onTouchEnd(): void {
    if (!this.isPulling()) return;
    
    if (this.pullDistance() >= this.PULL_THRESHOLD) {
      this.isRefreshing.set(true);
      this.pullDistance.set(this.PULL_THRESHOLD);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      this.isPulling.set(false);
      this.pullDistance.set(0);
    }
  }
}
