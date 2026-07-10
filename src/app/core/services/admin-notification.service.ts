import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificationLogDTO } from '../models/admin-notification.model';
import { PageResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/admin/notifications`;

  getNotificationLogs(page: number = 0, size: number = 10, status?: string): Observable<PageResponse<NotificationLogDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      
    if (status && status !== 'ALL') {
      params = params.set('status', status);
    }

    return this.http.get<any>(`${this.baseUrl}/logs`, { params }).pipe(
      map(response => response.data ? response.data : response)
    );
  }
}
