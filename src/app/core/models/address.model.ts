export interface Address {
  id?: number;
  contactName: string;
  mobileNumber: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}
