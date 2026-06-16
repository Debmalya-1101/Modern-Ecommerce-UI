import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface CustomSnackbarData {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  action?: string;
}

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="flex items-center justify-between w-full p-1" [ngClass]="containerClass">
      <div class="flex items-center gap-3">
        <mat-icon class="!w-6 !h-6 !text-[24px]" [ngClass]="iconColor">{{ icon }}</mat-icon>
        <span class="text-sm font-medium tracking-wide">{{ data.message }}</span>
      </div>
      <button *ngIf="data.action" mat-button (click)="snackBarRef.dismissWithAction()" 
              class="!font-bold tracking-wider text-xs uppercase opacity-90 hover:opacity-100 transition-opacity">
        {{ data.action }}
      </button>
      <button *ngIf="!data.action" mat-icon-button (click)="snackBarRef.dismiss()" 
              class="!scale-75 opacity-70 hover:opacity-100 transition-opacity">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class CustomSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: CustomSnackbarData,
    public snackBarRef: MatSnackBarRef<CustomSnackbarComponent>
  ) {}

  get icon(): string {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error_outline';
      default: return 'info';
    }
  }

  get iconColor(): string {
    // Relying on the parent background, we can make the icon white/light for contrast
    // Since the surface background is dark/colored based on type
    switch (this.data.type) {
      case 'success': return 'text-green-300';
      case 'info': return 'text-blue-300';
      case 'warning': return 'text-orange-300';
      case 'error': return 'text-red-300';
      default: return 'text-blue-300';
    }
  }

  get containerClass(): string {
    return 'custom-snackbar-container';
  }
}
