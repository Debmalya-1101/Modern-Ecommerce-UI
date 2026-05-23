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
}
