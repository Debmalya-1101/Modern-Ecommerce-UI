import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-shell-home-page',
  imports: [MatCardModule, MatDividerModule],
  templateUrl: './shell-home.page.html',
  styleUrl: './shell-home.page.scss'
})
export class ShellHomePage {}
