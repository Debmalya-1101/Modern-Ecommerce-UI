import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-image-placeholder',
  templateUrl: './product-image-placeholder.component.html',
  styleUrl: './product-image-placeholder.component.scss'
})
export class ProductImagePlaceholderComponent {
  /** URL of the real product image. When provided, shows an <img> tag. */
  @Input() src = '';

  /** Alt text / fallback label shown when no image URL is available. */
  @Input() label = 'Product image';

  /** Minimum height of the image area. */
  @Input() minHeight = '14rem';

  /** Tracks whether the real image failed to load so we can show the fallback. */
  protected imageLoadFailed = false;

  /** True when we have a URL and the image has not yet failed. */
  protected get showImage(): boolean {
    return !!this.src && !this.imageLoadFailed;
  }

  protected onImageError(): void {
    this.imageLoadFailed = true;
  }
}
