import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss'
})
export class SkeletonLoaderComponent {
  @Input() lines = 3;
  @Input() height = '0.9rem';
  @Input() width = '100%';
  @Input() rounded = true;

  protected get placeholders(): number[] {
    return Array.from({ length: this.lines }, (_, index) => index);
  }
}
