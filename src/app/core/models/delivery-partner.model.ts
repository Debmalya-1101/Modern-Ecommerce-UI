export enum VehicleType {
  BIKE = 'BIKE',
  SCOOTER = 'SCOOTER',
  CAR = 'CAR',
  VAN = 'VAN',
  OTHER = 'OTHER'
}

export enum DeliveryPartnerStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED'
}

export enum IdType {
  AADHAAR = 'AADHAAR',
  PAN = 'PAN',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  VOTER_ID = 'VOTER_ID',
  PASSPORT = 'PASSPORT'
}

/**
 * Matches backend: DeliveryPartnerSignupRequest.java
 * Fields aligned with what the backend actually accepts.
 */
export interface DeliveryPartnerSignupRequest {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  idType: IdType;
  idNumber: string;
}

/**
 * Matches backend: DeliveryPartnerResponseDTO.java
 * Fields returned by GET /api/admin/delivery-partners and GET /api/admin/delivery-partners/{id}
 */
export interface DeliveryPartnerResponseDTO {
  id: number;
  userId: number;
  fullName: string;
  email: string;          // backend returns 'email' (not 'emailId')
  phoneNumber: string;
  vehicleType: VehicleType;
  vehicleNumber: string;  // backend field name
  idType: IdType;
  idNumber: string;       // backend field name
  status: DeliveryPartnerStatus;
  dateOfBirth?: string;
  address?: string;
  reviewedByUserId?: number;
  reviewedByUsername?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryPartnerStatusUpdateRequest {
  status: DeliveryPartnerStatus;
}

/**
 * Matches backend: DeliveryPartnerDashboardDTO.java
 */
export interface DeliveryPartnerDashboardDTO {
  totalAssigned: number;
  totalPickedUp: number;
  totalOutForDelivery: number;
  totalDelivered: number;
  totalFailed: number;
}
