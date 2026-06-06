import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

export interface PasswordRecoveryResult {
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordRecoveryService {
  requestResetLink(email: string): Observable<PasswordRecoveryResult> {
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedEmail.includes('error') || normalizedEmail.includes('fail')) {
      return throwError(() => new Error('We could not send a reset link right now. Please try again.'))
        .pipe(delay(700));
    }

    return of({
      email: normalizedEmail,
      message: 'A placeholder reset email has been prepared for this address.'
    }).pipe(delay(900));
  }
}
