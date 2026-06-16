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
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export interface RetryPaymentRequest {
  orderId: number;
}
