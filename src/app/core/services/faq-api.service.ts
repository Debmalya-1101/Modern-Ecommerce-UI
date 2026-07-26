import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';

export interface Faq {
  id: number;
  question: string;
  answer: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FaqApiService {
  private readonly apiService = inject(ApiService);

  getFaqs(): Observable<Faq[]> {
    return this.apiService.get<Faq[]>(API_ENDPOINTS.faqs.list, undefined, { trackLoading: true });
  }
}
