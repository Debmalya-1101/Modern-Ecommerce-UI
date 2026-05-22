import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/shell-home/shell-home.page').then((m) => m.ShellHomePage)
  }
];
