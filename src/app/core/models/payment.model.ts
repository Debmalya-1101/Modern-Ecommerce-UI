export interface PaymentInitiateResponse {
  orderId: number;
  amount: number;
  currency: string;
  paymentToken: string;
  paymentReferenceId: string;
  paymentInitiatedAt: string;
}

export interface PaymentConfirmRequest {
  orderId: number;
  paymentToken: string;
  paymentReferenceId: string;
  success: boolean;
}

export interface RetryPaymentRequest {
  orderId: number;
}

export interface CreditCardDetails {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
}
