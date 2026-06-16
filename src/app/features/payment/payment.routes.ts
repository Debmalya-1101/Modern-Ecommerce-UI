import { Routes } from '@angular/router';

export const PAYMENT_ROUTES: Routes = [
  {
    path: 'success',
    loadComponent: () =>
      import('./payment-success.page').then((m) => m.PaymentSuccessPage)
  },
  {
    path: 'failure',
    loadComponent: () =>
      import('./payment-failure.page').then((m) => m.PaymentFailurePage)
  },
  {
    path: 'pending',
    loadComponent: () =>
      import('./payment-pending.page').then((m) => m.PaymentPendingPage)
  },
  {
    path: ':orderId',
    loadComponent: () =>
      import('./payment-processing.page').then((m) => m.PaymentProcessingPage)
  }
];
