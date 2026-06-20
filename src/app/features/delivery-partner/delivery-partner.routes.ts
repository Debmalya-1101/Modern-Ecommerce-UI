import { Routes } from '@angular/router';

import { authGuard } from '../../core/guards/auth.guard';
import { deliveryPartnerGuard } from '../../core/guards/delivery-partner.guard';

export const DELIVERY_PARTNER_ROUTES: Routes = [
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/dp-signup/dp-signup.component').then((m) => m.DpSignupComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, deliveryPartnerGuard],
    loadComponent: () =>
      import('./pages/dp-dashboard/dp-dashboard.component').then((m) => m.DpDashboardComponent)
  },
  {
    path: 'shipments/active',
    canActivate: [authGuard, deliveryPartnerGuard],
    loadComponent: () =>
      import('./pages/dp-shipments-active/dp-shipments-active.component').then((m) => m.DpShipmentsActiveComponent)
  },
  {
    path: 'shipments/history',
    canActivate: [authGuard, deliveryPartnerGuard],
    loadComponent: () =>
      import('./pages/dp-shipments-history/dp-shipments-history.component').then((m) => m.DpShipmentsHistoryComponent)
  },
  {
    path: 'shipments/:id',
    canActivate: [authGuard, deliveryPartnerGuard],
    loadComponent: () =>
      import('./pages/dp-shipment-detail/dp-shipment-detail.component').then((m) => m.DpShipmentDetailComponent)
  },
  {
    path: 'feedback',
    canActivate: [authGuard, deliveryPartnerGuard],
    loadComponent: () =>
      import('./pages/dp-feedback/dp-feedback.component').then((m) => m.DpFeedbackComponent)
  }
];
