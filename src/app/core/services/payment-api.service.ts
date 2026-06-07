import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import {
  PaymentConfirmRequest,
  PaymentInitiateResponse,
  RetryPaymentRequest
} from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentApiService {
  private readonly apiService = inject(ApiService);

  initiatePayment(orderId: number): Observable<PaymentInitiateResponse> {
    return this.apiService.post<PaymentInitiateResponse, null>(
      API_ENDPOINTS.payments.initiate(orderId),
      null,
      { trackLoading: true }
    );
  }

  confirmPayment(request: PaymentConfirmRequest): Observable<string> {
    return this.apiService.post<string, PaymentConfirmRequest>(
      API_ENDPOINTS.payments.confirm,
      request,
      { trackLoading: true, responseType: 'text' }
    );
  }

  retryPayment(request: RetryPaymentRequest): Observable<PaymentInitiateResponse> {
    return this.apiService.post<PaymentInitiateResponse, RetryPaymentRequest>(
      API_ENDPOINTS.payments.retry,
      request,
      { trackLoading: true }
    );
  }
}
