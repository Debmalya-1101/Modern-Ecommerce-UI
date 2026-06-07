import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-dashboard',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.scss'
})
export class AdminDashboardPage {
}
