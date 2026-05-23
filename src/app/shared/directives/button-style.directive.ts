import { Directive, HostBinding, Input } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'tonal' | 'danger';

@Directive({
  selector: 'button[appButtonStyle], a[appButtonStyle]'
})
export class ButtonStyleDirective {
  @Input() appButtonStyle: ButtonVariant = 'primary';

  @HostBinding('class.shared-button')
  protected readonly sharedButtonClass = true;

  @HostBinding('class.shared-button--primary')
  protected get isPrimary(): boolean {
    return this.appButtonStyle === 'primary';
  }

  @HostBinding('class.shared-button--secondary')
  protected get isSecondary(): boolean {
    return this.appButtonStyle === 'secondary';
  }

  @HostBinding('class.shared-button--tonal')
  protected get isTonal(): boolean {
    return this.appButtonStyle === 'tonal';
  }

  @HostBinding('class.shared-button--danger')
  protected get isDanger(): boolean {
    return this.appButtonStyle === 'danger';
  }
}
