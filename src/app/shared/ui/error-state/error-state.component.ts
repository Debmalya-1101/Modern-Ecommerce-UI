import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ButtonStyleDirective } from '../../directives/button-style.directive';

@Component({
  selector: 'app-error-state',
  imports: [MatButtonModule, MatCardModule, ButtonStyleDirective],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss'
})
export class ErrorStateComponent {
  @Input() title = 'Something went wrong';
  @Input() description = 'Please try again in a moment.';
  @Input() actionLabel = 'Try again';
  @Output() action = new EventEmitter<void>();

  protected handleAction(): void {
    this.action.emit();
  }
}
