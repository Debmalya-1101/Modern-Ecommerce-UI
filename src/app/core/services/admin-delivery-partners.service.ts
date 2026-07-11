import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/api.model';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import {
  DeliveryPartnerResponseDTO,
  DeliveryPartnerStatusUpdateRequest
} from '../models/delivery-partner.model';
import { DeliveryPartnerRatingSummaryDTO } from '../models/delivery-feedback.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminDeliveryPartnersService {
  private readonly apiService = inject(ApiService);

  getPartners(status?: string, page = 0, size = 10): Observable<PageResponse<DeliveryPartnerResponseDTO>> {
    const params: Record<string, string | number> = { page, size };
    if (status && status !== 'ALL') {
      params['status'] = status;
    }
    return this.apiService.get<PageResponse<DeliveryPartnerResponseDTO>>(
      API_ENDPOINTS.adminDelivery.partners.root,
      params,
      { trackLoading: true }
    );
  }

  getPartnerById(id: number): Observable<DeliveryPartnerResponseDTO> {
    return this.apiService.get<DeliveryPartnerResponseDTO>(
      API_ENDPOINTS.adminDelivery.partners.detail(id),
      undefined,
      { trackLoading: true }
    );
  }

  updatePartnerStatus(id: number, request: DeliveryPartnerStatusUpdateRequest): Observable<DeliveryPartnerResponseDTO> {
    return this.apiService.put<DeliveryPartnerResponseDTO, DeliveryPartnerStatusUpdateRequest>(
      API_ENDPOINTS.adminDelivery.partners.status(id),
      request,
      undefined,
      { trackLoading: true }
    );
  }

  getPartnerRatings(): Observable<DeliveryPartnerRatingSummaryDTO[]> {
    return this.apiService.get<DeliveryPartnerRatingSummaryDTO[]>(
      API_ENDPOINTS.adminDelivery.partners.ratings,
      undefined,
      { trackLoading: true }
    );
  }
}
