import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-empty-state',
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'Nothing to show yet';
  @Input() description = 'This section is ready for future content.';
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();

  protected handleAction(): void {
    this.action.emit();
  }
}
