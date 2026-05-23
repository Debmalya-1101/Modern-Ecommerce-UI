import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  info(message: string, action = 'Dismiss'): void {
    this.open(message, action, ['app-snackbar', 'app-snackbar--info']);
  }

  success(message: string, action = 'Dismiss'): void {
    this.open(message, action, ['app-snackbar', 'app-snackbar--success']);
  }

  warning(message: string, action = 'Dismiss'): void {
    this.open(message, action, ['app-snackbar', 'app-snackbar--warning']);
  }

  error(message: string, action = 'Dismiss'): void {
    this.open(message, action, ['app-snackbar', 'app-snackbar--error']);
  }

  private open(message: string, action: string, panelClass: string[]): void {
    this.snackBar.open(message, action, {
      duration: 3200,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass
    });
  }
}
