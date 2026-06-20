import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { DeliveryPartnerSignupRequest } from '../models/delivery-partner.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryAuthService {
  private readonly apiService = inject(ApiService);

  signup(request: DeliveryPartnerSignupRequest): Observable<string> {
    return this.apiService.post<string, DeliveryPartnerSignupRequest>(
      API_ENDPOINTS.deliveryPartner.auth.signup,
      request,
      { trackLoading: true, responseType: 'text' }
    );
  }
}
