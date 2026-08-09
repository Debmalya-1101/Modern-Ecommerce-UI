import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
  @Input() label = 'Loading content';
  @Input() diameter = 56;
  @Input() fullScreen = false;
  @Input() logoUrl = '/logo.png';

  @HostBinding('class.is-fullscreen') get isFullscreen() {
    return this.fullScreen;
  }
}

