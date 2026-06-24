import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-category-chip',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './product-category-chip.component.html',
  styleUrl: './product-category-chip.component.scss'
})
export class ProductCategoryChipComponent {
  @Input() label = 'Category';

  get icon(): string {
    const cat = this.label.toLowerCase();
    if (cat.includes('phone') || cat.includes('mobile')) return 'smartphone';
    if (cat.includes('tablet')) return 'tablet_mac';
    if (cat.includes('laptop') || cat.includes('computer')) return 'laptop_mac';
    if (cat.includes('audio') || cat.includes('head')) return 'headphones';
    if (cat.includes('watch') || cat.includes('wearable')) return 'watch';
    return 'category';
  }
}
