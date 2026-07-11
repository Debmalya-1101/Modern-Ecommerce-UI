import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/api.model';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { ShipmentResponseDTO } from '../models/shipment.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminShipmentsService {
  private readonly apiService = inject(ApiService);

  getUnassignedShipments(page = 0, size = 10): Observable<PageResponse<ShipmentResponseDTO>> {
    return this.apiService.get<PageResponse<ShipmentResponseDTO>>(
      API_ENDPOINTS.adminDelivery.shipments.unassigned,
      { page, size },
      { trackLoading: true }
    );
  }

  assignShipment(shipmentId: number, partnerId: number): Observable<ShipmentResponseDTO> {
    return this.apiService.post<ShipmentResponseDTO, null>(
      API_ENDPOINTS.adminDelivery.shipments.assign(shipmentId, partnerId),
      null,
      { trackLoading: true }
    );
  }
}
