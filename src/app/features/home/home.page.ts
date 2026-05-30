import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { AppHttpError, createInitialRequestState } from '../../core/models/api.model';
import { BackendConnectionStatus } from '../../core/models/backend-status.model';
import { BackendStatusService } from '../../core/services/backend-status.service';
import { ConfirmationDialogService } from '../../shared/services/confirmation-dialog.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { ButtonStyleDirective } from '../../shared/directives/button-style.directive';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';
import { SkeletonLoaderComponent } from '../../shared/ui/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-home-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    ButtonStyleDirective,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingSpinnerComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly backendStatusService = inject(BackendStatusService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly confirmationDialogService = inject(ConfirmationDialogService);

  protected readonly lastAction = signal('No shared action has been triggered yet.');
  protected readonly backendStatus = signal(createInitialRequestState<BackendConnectionStatus>());

  ngOnInit(): void {
    this.checkBackendConnection();
  }

  protected showInfoMessage(): void {
    this.snackbarService.info('Shared snackbar utility is ready to use.');
    this.lastAction.set('Info snackbar opened.');
  }

  protected showSuccessMessage(): void {
    this.snackbarService.success('Success snackbar example shown.');
    this.lastAction.set('Success snackbar opened.');
  }

  protected showWarningMessage(): void {
    this.snackbarService.warning('Warning snackbar example shown.');
    this.lastAction.set('Warning snackbar opened.');
  }

  protected handleEmptyAction(): void {
    this.snackbarService.info('Empty state action clicked.');
    this.lastAction.set('Empty state action button clicked.');
  }

  protected handleRetryAction(): void {
    this.snackbarService.error('Retry action triggered from the error state.');
    this.lastAction.set('Error state retry button clicked.');
  }

  protected openConfirmationDialog(): void {
    this.confirmationDialogService
      .open({
        title: 'Confirm shared UI action',
        message: 'This dialog is a reusable confirmation pattern for future app actions.',
        confirmLabel: 'Continue',
        cancelLabel: 'Not now'
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.snackbarService.success('Confirmation dialog returned true.');
          this.lastAction.set('Confirmation dialog accepted.');
          return;
        }

        this.snackbarService.info('Confirmation dialog was cancelled.');
        this.lastAction.set('Confirmation dialog closed without confirmation.');
      });
  }

  protected retryBackendConnection(): void {
    this.checkBackendConnection();
  }

  private checkBackendConnection(): void {
    this.backendStatus.set({
      data: null,
      error: null,
      loading: true
    });

    this.backendStatusService
      .checkConnection()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.backendStatus.update((state) => ({
            ...state,
            loading: false
          }));
        })
      )
      .subscribe({
        next: (status) => {
          this.backendStatus.set({
            data: status,
            error: null,
            loading: false
          });
        },
        error: (error: AppHttpError) => {
          this.backendStatus.set({
            data: null,
            error: error.message,
            loading: false
          });
        }
      });
  }
}
