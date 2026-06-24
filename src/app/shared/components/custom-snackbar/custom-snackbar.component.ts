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
    <div class="flex items-center justify-between w-full min-w-[320px] max-w-[450px] pl-4 pr-2 py-3 rounded-2xl shadow-xl border border-white/10 backdrop-blur-md" 
         [ngClass]="containerClass">
      
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-8 h-8 rounded-full" [ngClass]="iconBgClass">
          <mat-icon class="!w-5 !h-5 !text-[20px] text-white">{{ icon }}</mat-icon>
        </div>
        <span class="text-[0.95rem] font-semibold tracking-wide text-white">{{ data.message }}</span>
      </div>

      <div class="ml-4">
        <button *ngIf="data.action" mat-button (click)="snackBarRef.dismissWithAction()" 
                class="!font-bold tracking-wider text-xs uppercase !text-white opacity-90 hover:bg-white/10 !rounded-xl transition-all">
          {{ data.action }}
        </button>
        <button *ngIf="!data.action" mat-icon-button (click)="snackBarRef.dismiss()" 
                class="!scale-90 text-white/70 hover:text-white hover:bg-white/10 transition-all">
          <mat-icon>close</mat-icon>
        </button>
      </div>

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
      case 'success': return 'check';
      case 'info': return 'info_outline';
      case 'warning': return 'warning_amber';
      case 'error': return 'error_outline';
      default: return 'info_outline';
    }
  }

  get iconBgClass(): string {
    switch (this.data.type) {
      case 'success': return 'bg-emerald-500/30';
      case 'info': return 'bg-blue-500/30';
      case 'warning': return 'bg-amber-500/30';
      case 'error': return 'bg-rose-500/30';
      default: return 'bg-white/20';
    }
  }

  get containerClass(): string {
    switch (this.data.type) {
      case 'success': return 'bg-[#2b4c34] text-white';
      case 'info': return 'bg-[#3b332d] text-white';
      case 'warning': return 'bg-[#6b4a22] text-white';
      case 'error': return 'bg-[#823322] text-white';
      default: return 'bg-[#3b332d] text-white';
    }
  }
}
