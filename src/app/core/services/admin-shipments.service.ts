import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { ShipmentResponseDTO } from '../models/shipment.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminShipmentsService {
  private readonly apiService = inject(ApiService);

  getUnassignedShipments(): Observable<ShipmentResponseDTO[]> {
    return this.apiService.get<ShipmentResponseDTO[]>(
      API_ENDPOINTS.adminDelivery.shipments.unassigned,
      undefined,
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
