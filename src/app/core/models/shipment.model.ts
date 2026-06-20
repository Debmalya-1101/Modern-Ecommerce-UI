export enum ShipmentStatus {
  CREATED = 'CREATED',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED'
}

export interface ShipmentResponseDTO {
  id: number;
  orderId: number;
  deliveryPartnerId?: number;
  status: ShipmentStatus;
  trackingNumber: string;
  expectedDeliveryDate?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentStatusUpdateRequest {
  status: ShipmentStatus;
  failureReason?: string;
}
