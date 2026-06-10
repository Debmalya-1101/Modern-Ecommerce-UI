import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-product-badge',
  imports: [MatChipsModule],
  templateUrl: './product-badge.component.html',
  styleUrl: './product-badge.component.scss'
})
export class ProductBadgeComponent {
  @Input() label = 'Featured';

  protected getBadgeClass(): string {
    const label = this.label.toLowerCase();
    if (label.includes('off') || label.includes('sale') || label.includes('save')) {
      return 'badge-sale';
    }
    if (label.includes('rated') || label.includes('top')) {
      return 'badge-top-rated';
    }
    if (label.includes('trending') || label.includes('seller') || label.includes('hot')) {
      return 'badge-trending';
    }
    return '';
  }
}
