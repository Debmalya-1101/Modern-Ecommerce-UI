import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-product-category-chip',
  imports: [MatChipsModule],
  templateUrl: './product-category-chip.component.html',
  styleUrl: './product-category-chip.component.scss'
})
export class ProductCategoryChipComponent {
  @Input() label = 'Category';
}
