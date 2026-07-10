import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { DashboardAnalyticsDTO } from '../models/admin-analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AdminAnalyticsService {
  private readonly apiService = inject(ApiService);

  getDashboardAnalytics(): Observable<DashboardAnalyticsDTO> {
    return this.apiService.get<DashboardAnalyticsDTO>(
      API_ENDPOINTS.admin.analyticsDashboard,
      undefined,
      { trackLoading: true }
    );
  }
}
