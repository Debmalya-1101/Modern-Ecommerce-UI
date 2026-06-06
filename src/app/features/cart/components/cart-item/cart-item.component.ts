import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { CartItem } from '../../../../core/models/cart.model';
import { ProductImagePlaceholderComponent } from '../../../../shared/ui/product/product-image-placeholder/product-image-placeholder.component';
import { APP_CONSTANTS } from '../../../../core/config/app.constants';

@Component({
  selector: 'app-cart-item',
  imports: [
    CurrencyPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ProductImagePlaceholderComponent
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Input() disabled = false;

  protected readonly currencyCode = APP_CONSTANTS.currencyCode;
  
  @Output() increaseQuantity = new EventEmitter<number>();
  @Output() decreaseQuantity = new EventEmitter<number>();
  @Output() removeItem = new EventEmitter<number>();
  @Output() saveForLater = new EventEmitter<number>();

  protected onIncrease(): void {
    if (!this.disabled) {
      this.increaseQuantity.emit(this.item.itemId);
    }
  }

  protected onDecrease(): void {
    if (!this.disabled) {
      this.decreaseQuantity.emit(this.item.itemId);
    }
  }

  protected onRemove(): void {
    if (!this.disabled) {
      this.removeItem.emit(this.item.itemId);
    }
  }

  protected onSaveForLater(): void {
    if (!this.disabled) {
      this.saveForLater.emit(this.item.itemId);
    }
  }
}
