import { Component } from '@angular/core';

import { RoutePlaceholderComponent } from '../../shared/ui/route-placeholder/route-placeholder.component';

@Component({
  selector: 'app-profile-page',
  imports: [RoutePlaceholderComponent],
  template: `
    <app-route-placeholder
      eyebrow="Profile feature route"
      title="Profile placeholder"
      description="This route will later show account details and a user-focused summary area."
      [highlights]="highlights"
    />
  `
})
export class ProfilePage {
  protected readonly highlights = [
    'Ready for logged-in user information and profile actions',
    'Can later connect to /auth/me for current user details',
    'Keeps account-focused UI separated from order and checkout screens'
  ];
}
