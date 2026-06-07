import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { Wishlist, WishlistItem } from '../models/wishlist.model';
import { WishlistApiService } from './wishlist-api.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly wishlistApi = inject(WishlistApiService);
  private readonly snackbar = inject(SnackbarService);
  private readonly authService = inject(AuthService);

  private readonly _wishlist = signal<Wishlist>({ items: [] });
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly state
  public readonly wishlist = this._wishlist.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  // Derived computed signals
  public readonly items = computed(() => this.wishlist().items);
  public readonly itemCount = computed(() => this.wishlist().items.length);
  public readonly isEmpty = computed(() => this.wishlist().items.length === 0);

  constructor() {
    // Automatically load/clear wishlist when auth state changes
    effect(() => {
      const isAuthenticated = this.authService.isAuthenticated();
      if (isAuthenticated) {
        this.loadWishlist();
      } else {
        this._wishlist.set({ items: [] });
      }
    });
  }

  public loadWishlist(): void {
    this._loading.set(true);
    this._error.set(null);

    this.wishlistApi.getWishlist().subscribe({
      next: (wishlist) => {
        this._wishlist.set(wishlist);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Could not load your wishlist.');
        this._loading.set(false);
      }
    });
  }

  public hasItem(productId: number): boolean {
    return this.items().some(item => item.productId === productId);
  }

  public toggleWishlist(productId: number): void {
    const currentItems = this._wishlist().items;
    const isCurrentlyInWishlist = this.hasItem(productId);
    const previousWishlist = this._wishlist();

    if (isCurrentlyInWishlist) {
      // Optimistic remove
      const updatedItems = currentItems.filter(i => i.productId !== productId);
      this._wishlist.set({ items: updatedItems });
      
      this.wishlistApi.toggleWishlist(productId).subscribe({
        next: (updatedWishlist) => {
          this._wishlist.set(updatedWishlist);
        },
        error: () => {
          this._wishlist.set(previousWishlist);
          this.snackbar.error('Failed to remove item from wishlist.');
        }
      });
    } else {
      // Optimistically add a placeholder item
      const tempItem: WishlistItem = {
        itemId: -1, // placeholder
        productId,
        productName: '...',
        imageUrl: '',
        price: 0,
        rating: 0
      };
      this._wishlist.set({ items: [...currentItems, tempItem] });

      this.wishlistApi.toggleWishlist(productId).subscribe({
        next: (updatedWishlist) => {
          this._wishlist.set(updatedWishlist);
          this.snackbar.success('Item saved to wishlist.');
        },
        error: () => {
          this._wishlist.set(previousWishlist);
          this.snackbar.error('Failed to add item to wishlist.');
        }
      });
    }
  }

  public removeFromWishlist(itemId: number): void {
    const previousWishlist = this._wishlist();

    // Optimistic remove
    const updatedItems = previousWishlist.items.filter(item => item.itemId !== itemId);
    this._wishlist.set({ items: updatedItems });

    this.wishlistApi.removeItem(itemId).subscribe({
      next: (updatedWishlist) => {
        this._wishlist.set(updatedWishlist);
        this.snackbar.success('Item removed from wishlist.');
      },
      error: () => {
        this._wishlist.set(previousWishlist);
        this.snackbar.error('Failed to remove item. Restored item to wishlist.');
      }
    });
  }
}
