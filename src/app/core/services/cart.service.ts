import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Cart, CartItem } from '../models/cart.model';
import { CartApiService } from './cart-api.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { AuthService } from './auth.service';
import { CartRequestQueueService } from './cart-request-queue.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartApi = inject(CartApiService);
  private readonly snackbar = inject(SnackbarService);
  private readonly authService = inject(AuthService);
  private readonly requestQueue = inject(CartRequestQueueService);
  private readonly router = inject(Router);

  private readonly _cart = signal<Cart>({ items: [], cartTotal: 0 });
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _updatingItemIds = signal<Set<number>>(new Set());
  private readonly _isDrawerOpen = signal<boolean>(false);
  private readonly _savedItems = signal<CartItem[]>([]);
  private readonly _isAddingToCart = signal<boolean>(false);

  // Public readonly state
  public readonly cart = this._cart.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly updatingItemIds = this._updatingItemIds.asReadonly();
  public readonly isDrawerOpen = this._isDrawerOpen.asReadonly();
  public readonly savedItems = this._savedItems.asReadonly();
  public readonly isAddingToCart = this._isAddingToCart.asReadonly();

  // Derived computed signals
  public readonly items = computed(() => this.cart().items);
  public readonly total = computed(() => this.cart().cartTotal);
  public readonly itemCount = computed(() =>
    this.cart().items.reduce((sum, item) => sum + item.quantity, 0)
  );
  public readonly isEmpty = computed(() => this.cart().items.length === 0 && !this.isAddingToCart());

  public isItemUpdating(itemId: number) {
    return computed(() => this.updatingItemIds().has(itemId));
  }

  constructor() {
    // When the user authentication state changes (e.g., they log in), automatically reload the cart
    effect(() => {
      const isAuthenticated = this.authService.isAuthenticated();
      if (isAuthenticated) {
        this.loadCart();
      } else {
        this._cart.set({ items: [], cartTotal: 0 });
      }
    });
  }

  public loadCart(): void {
    this._loading.set(true);
    this._error.set(null);

    this.cartApi.getCart().subscribe({
      next: (cart) => {
        this._cart.set(cart);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set('Could not load your shopping cart.');
        this._loading.set(false);
      }
    });
  }

  public addToCart(productId: number, quantity = 1): void {
    // Check if item is already in the cart for optimistic update
    const currentItems = this._cart().items;
    const existingItem = currentItems.find(item => item.productId === productId);
    
    if (existingItem) {
      // If it exists, we just update the quantity
      this.updateQuantity(existingItem.itemId, existingItem.quantity + quantity);
      if (!this.router.url.includes('/cart')) {
        this.openDrawer();
      }
      return;
    }

    this._isAddingToCart.set(true);
    if (!this.router.url.includes('/cart')) {
      this.openDrawer();
    }

    this.cartApi.addToCart(productId, quantity).subscribe({
      next: (updatedCart) => {
        this._cart.set(updatedCart);
        this._isAddingToCart.set(false);
        this.snackbar.success('Item added to cart.');
      },
      error: () => {
        this._isAddingToCart.set(false);
        this.snackbar.error('Could not add item to cart.');
      }
    });
  }

  public updateQuantity(itemId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    const previousCart = this._cart();

    // Mark item as updating
    this._updatingItemIds.update(set => {
      const newSet = new Set(set);
      newSet.add(itemId);
      return newSet;
    });

    // Optimistic Update
    this._cart.update(current => {
      const updatedItems = current.items.map(item => {
        if (item.itemId === itemId) {
          return {
            ...item,
            quantity,
            total: item.price * quantity
          };
        }
        return item;
      });
      
      const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      return { items: updatedItems, cartTotal: newTotal };
    });

    this.requestQueue.enqueueQuantityUpdate({
      itemId,
      quantity,
      onSuccess: (updatedCart) => {
        this._cart.set(updatedCart);
        this._updatingItemIds.update(set => {
          const newSet = new Set(set);
          newSet.delete(itemId);
          return newSet;
        });
      },
      onError: () => {
        // Rollback
        this._cart.set(previousCart);
        this.snackbar.error('Failed to update quantity.');
        this._updatingItemIds.update(set => {
          const newSet = new Set(set);
          newSet.delete(itemId);
          return newSet;
        });
      }
    });
  }

  public removeFromCart(itemId: number): void {
    const previousCart = this._cart();

    this._updatingItemIds.update(set => {
      const newSet = new Set(set);
      newSet.add(itemId);
      return newSet;
    });

    // Optimistic remove
    this._cart.update(current => {
      const updatedItems = current.items.filter(item => item.itemId !== itemId);
      const newTotal = updatedItems.reduce((sum, item) => sum + item.total, 0);
      return { items: updatedItems, cartTotal: newTotal };
    });

    this.cartApi.removeItem(itemId).subscribe({
      next: (updatedCart) => {
        this._cart.set(updatedCart);
        this.snackbar.success('Item removed from cart.');
        this._updatingItemIds.update(set => {
          const newSet = new Set(set);
          newSet.delete(itemId);
          return newSet;
        });
      },
      error: () => {
        // Rollback
        this._cart.set(previousCart);
        this.snackbar.error('Failed to remove item. Restored item to cart.');
        this._updatingItemIds.update(set => {
          const newSet = new Set(set);
          newSet.delete(itemId);
          return newSet;
        });
      }
    });
  }

  public openDrawer(): void {
    this._isDrawerOpen.set(true);
  }

  public closeDrawer(): void {
    this._isDrawerOpen.set(false);
  }

  public toggleDrawer(): void {
    this._isDrawerOpen.update(v => !v);
  }

  // --- Save For Later Methods ---

  public saveForLater(itemId: number): void {
    const item = this._cart().items.find(i => i.itemId === itemId);
    if (item) {
      this._savedItems.update(items => [...items, item]);
      this.removeFromCart(itemId);
      this.snackbar.success('Item saved for later.');
    }
  }

  public moveToCart(itemId: number): void {
    const item = this._savedItems().find(i => i.itemId === itemId);
    if (item) {
      this.addToCart(item.productId, item.quantity);
      this.removeSavedItem(itemId);
    }
  }

  public removeSavedItem(itemId: number): void {
    this._savedItems.update(items => items.filter(i => i.itemId !== itemId));
    this.snackbar.success('Item removed from saved list.');
  }
}
