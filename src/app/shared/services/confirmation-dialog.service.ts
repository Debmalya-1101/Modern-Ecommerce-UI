import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ConfirmationDialogComponent } from '../ui/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../ui/confirmation-dialog/confirmation-dialog.types';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  private readonly dialog = inject(MatDialog);

  open(options: ConfirmationDialogData): Observable<boolean | undefined> {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        width: '26rem',
        maxWidth: '92vw',
        data: options
      })
      .afterClosed();
  }
}
