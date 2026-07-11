import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/api.model';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import {
  ShipmentResponseDTO,
  ShipmentStatusUpdateRequest
} from '../models/shipment.model';
import { DeliveryPartnerDashboardDTO } from '../models/delivery-partner.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DeliveryPartnerShipmentsService {
  private readonly apiService = inject(ApiService);

  getDashboard(): Observable<DeliveryPartnerDashboardDTO> {
    return this.apiService.get<DeliveryPartnerDashboardDTO>(
      API_ENDPOINTS.deliveryPartner.shipments.dashboard,
      undefined,
      { trackLoading: true }
    );
  }

  getActiveShipments(page = 0, size = 10): Observable<PageResponse<ShipmentResponseDTO>> {
    return this.apiService.get<PageResponse<ShipmentResponseDTO>>(
      API_ENDPOINTS.deliveryPartner.shipments.active,
      { page, size },
      { trackLoading: true }
    );
  }

  getShipmentHistory(page = 0, size = 10): Observable<PageResponse<ShipmentResponseDTO>> {
    return this.apiService.get<PageResponse<ShipmentResponseDTO>>(
      API_ENDPOINTS.deliveryPartner.shipments.history,
      { page, size },
      { trackLoading: true }
    );
  }

  getShipmentDetails(id: number): Observable<ShipmentResponseDTO> {
    return this.apiService.get<ShipmentResponseDTO>(
      API_ENDPOINTS.deliveryPartner.shipments.detail(id),
      undefined,
      { trackLoading: true }
    );
  }

  updateShipmentStatus(id: number, request: ShipmentStatusUpdateRequest): Observable<ShipmentResponseDTO> {
    return this.apiService.put<ShipmentResponseDTO, ShipmentStatusUpdateRequest>(
      API_ENDPOINTS.deliveryPartner.shipments.status(id),
      request,
      undefined,
      { trackLoading: true }
    );
  }
}
