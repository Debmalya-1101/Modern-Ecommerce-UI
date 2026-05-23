import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-route-placeholder',
  imports: [MatCardModule],
  templateUrl: './route-placeholder.component.html',
  styleUrl: './route-placeholder.component.scss'
})
export class RoutePlaceholderComponent {
  @Input() eyebrow = 'Feature route';
  @Input() title = 'Feature placeholder';
  @Input() description = 'This route is ready for future feature work.';
  @Input() highlights: string[] = [];
}
