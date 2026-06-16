import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent, CustomSnackbarData } from '../components/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  info(message: string, action = 'Dismiss'): void {
    this.open(message, 'info', action, ['app-snackbar', 'app-snackbar--info']);
  }

  success(message: string, action = 'Dismiss'): void {
    this.open(message, 'success', action, ['app-snackbar', 'app-snackbar--success']);
  }

  warning(message: string, action = 'Dismiss'): void {
    this.open(message, 'warning', action, ['app-snackbar', 'app-snackbar--warning']);
  }

  error(message: string, action = 'Dismiss'): void {
    this.open(message, 'error', action, ['app-snackbar', 'app-snackbar--error']);
  }

  private open(message: string, type: CustomSnackbarData['type'], action: string, panelClass: string[]): void {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message, type, action },
      duration: 3200,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass
    });
  }
}
