import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFormat',
  standalone: true
})
export class StatusFormatPipe implements PipeTransform {

  private readonly statusMap: Record<string, string> = {
    // Order Statuses
    'PENDING_PAYMENT': 'Awaiting Payment',
    'PAYMENT_FAILED': 'Payment Failed',
    'CONFIRMED': 'Order Confirmed',
    'PROCESSING': 'Being Prepared',
    'SHIPPED': 'Shipped',
    'OUT_FOR_DELIVERY': 'Out for Delivery',
    'DELIVERED': 'Delivered ✅',
    'DELIVERY_FAILED': 'Delivery Failed',
    'CANCELLED': 'Cancelled',
    'RETURNED': 'Returned',
    
    // Shipment Statuses
    'CREATED': 'Created',
    'ASSIGNED': 'Assigned',
    'PICKED_UP': 'Picked Up',

    // Delivery Partner Statuses
    'PENDING': 'Pending',
    'APPROVED': 'Approved',
    'REJECTED': 'Rejected',
    'SUSPENDED': 'Suspended',
    
    // Payment Statuses (often INITIATED, COMPLETED, FAILED)
    'INITIATED': 'Initiated',
    'COMPLETED': 'Completed',
    'FAILED': 'Failed',

    // User Statuses & Roles
    'ACTIVE': 'Active',
    'INACTIVE': 'Inactive',
    'ROLE_USER': 'User',
    'ROLE_ADMIN': 'Admin',
    'ROLE_DELIVERY_PARTNER': 'Delivery Partner'
  };

  transform(value: string | undefined | null): string {
    if (!value) {
      return '';
    }

    const uppercaseValue = value.toUpperCase();

    // Direct mapping if available
    if (this.statusMap[uppercaseValue]) {
      return this.statusMap[uppercaseValue];
    }

    // Fallback: replace underscores with spaces and capitalize each word
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
