import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

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

  getActiveShipments(): Observable<ShipmentResponseDTO[]> {
    return this.apiService.get<ShipmentResponseDTO[]>(
      API_ENDPOINTS.deliveryPartner.shipments.active,
      undefined,
      { trackLoading: true }
    );
  }

  getShipmentHistory(): Observable<ShipmentResponseDTO[]> {
    return this.apiService.get<ShipmentResponseDTO[]>(
      API_ENDPOINTS.deliveryPartner.shipments.history,
      undefined,
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
