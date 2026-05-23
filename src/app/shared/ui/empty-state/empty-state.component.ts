import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ButtonStyleDirective } from '../../directives/button-style.directive';

@Component({
  selector: 'app-empty-state',
  imports: [MatButtonModule, MatCardModule, ButtonStyleDirective],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Input() title = 'Nothing to show yet';
  @Input() description = 'This section is ready for future content.';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();

  protected handleAction(): void {
    this.action.emit();
  }
}
