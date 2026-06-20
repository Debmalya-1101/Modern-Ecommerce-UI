import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import {
  DeliveryFeedbackRequestDTO,
  DeliveryFeedbackResponseDTO,
  AdminDeliveryFeedbackResponseDTO,
  DeliveryPartnerRatingSummaryDTO,
  DeliveryFeedbackStatusDTO
} from '../models/delivery-feedback.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryFeedbackService {
  private readonly apiService = inject(ApiService);

  checkFeedbackStatus(orderId: number): Observable<DeliveryFeedbackStatusDTO> {
    return this.apiService.get<DeliveryFeedbackStatusDTO>(
      API_ENDPOINTS.orders.deliveryFeedbackStatus(orderId),
      undefined,
      { trackLoading: true }
    );
  }

  // Customer: Create feedback
  submitFeedback(orderId: number, request: DeliveryFeedbackRequestDTO): Observable<DeliveryFeedbackResponseDTO> {
    return this.apiService.post<DeliveryFeedbackResponseDTO, DeliveryFeedbackRequestDTO>(
      API_ENDPOINTS.orders.deliveryFeedback(orderId),
      request,
      { trackLoading: true }
    );
  }

  // DP: View own feedback
  getPartnerFeedback(): Observable<DeliveryFeedbackResponseDTO[]> {
    return this.apiService.get<DeliveryFeedbackResponseDTO[]>(
      API_ENDPOINTS.deliveryPartner.feedback.root,
      undefined,
      { trackLoading: true }
    );
  }

  // DP: View own rating summary
  getPartnerFeedbackSummary(): Observable<DeliveryPartnerRatingSummaryDTO> {
    return this.apiService.get<DeliveryPartnerRatingSummaryDTO>(
      API_ENDPOINTS.deliveryPartner.feedback.summary,
      undefined,
      { trackLoading: true }
    );
  }

  // Admin: View a specific DP's feedback
  getAdminPartnerFeedback(partnerId: number): Observable<AdminDeliveryFeedbackResponseDTO[]> {
    return this.apiService.get<AdminDeliveryFeedbackResponseDTO[]>(
      API_ENDPOINTS.adminDelivery.partners.feedback(partnerId),
      undefined,
      { trackLoading: true }
    );
  }

  // Admin: View rating summaries for all DPs
  getAdminPartnerRatings(): Observable<DeliveryPartnerRatingSummaryDTO[]> {
    return this.apiService.get<DeliveryPartnerRatingSummaryDTO[]>(
      API_ENDPOINTS.adminDelivery.partners.ratings,
      undefined,
      { trackLoading: true }
    );
  }
}
