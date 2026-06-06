import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../../core/services/cart.service';
import { ProductImagePlaceholderComponent } from '../../../../shared/ui/product/product-image-placeholder/product-image-placeholder.component';
import { ButtonStyleDirective } from '../../../../shared/directives/button-style.directive';
import { APP_CONSTANTS } from '../../../../core/config/app.constants';

@Component({
  selector: 'app-save-for-later-list',
  imports: [
    CurrencyPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    ProductImagePlaceholderComponent,
    ButtonStyleDirective
  ],
  templateUrl: './save-for-later-list.component.html',
  styleUrl: './save-for-later-list.component.scss'
})
export class SaveForLaterListComponent {
  private readonly cartService = inject(CartService);

  public readonly savedItems = this.cartService.savedItems;
  protected readonly currencyCode = APP_CONSTANTS.currencyCode;

  protected moveToCart(itemId: number): void {
    this.cartService.moveToCart(itemId);
  }

  protected removeItem(itemId: number): void {
    this.cartService.removeSavedItem(itemId);
  }
}
