import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { AdminOrder, AdminOrderFilters } from '../models/admin-order.model';
import { PageResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
  private apiService = inject(ApiService);

  private mockOrders: AdminOrder[] = [
    {
      orderId: 1,
      userName: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St, New York, NY 10001',
      phoneNo: '9876543210',
      total: 1299.99,
      status: 'PLACED',
      createdAt: new Date().toISOString(),
      items: [
        { productId: 1, productName: 'Apple iPhone 15 Pro', quantity: 1, price: 1299.99, total: 1299.99 }
      ]
    },
    {
      orderId: 2,
      userName: 'Jane Smith',
      email: 'jane@example.com',
      address: '456 Market St, San Francisco, CA 94103',
      phoneNo: '9876543211',
      total: 899.50,
      status: 'SHIPPED',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      items: [
        { productId: 2, productName: 'Samsung Galaxy S24', quantity: 1, price: 899.50, total: 899.50 }
      ]
    },
    {
      orderId: 3,
      userName: 'Bob Johnson',
      email: 'bob@example.com',
      address: '789 Broadway, Seattle, WA 98101',
      phoneNo: '9876543212',
      total: 249.99,
      status: 'DELIVERED',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      items: [
        { productId: 3, productName: 'Sony WH-1000XM5', quantity: 1, price: 249.99, total: 249.99 }
      ]
    }
  ];

  getOrders(filters?: AdminOrderFilters): Observable<PageResponse<AdminOrder>> {
    let params: any = {};
    if (filters) {
      if (filters.status) params.status = filters.status;
      if (filters.page !== undefined) params.page = filters.page.toString();
      if (filters.size !== undefined) params.size = filters.size.toString();
    }

    return this.apiService.get<PageResponse<AdminOrder>>(API_ENDPOINTS.admin.orders, params).pipe(
      catchError(error => {
        console.warn('Backend unavailable or error fetching orders. Using mock data.', error);
        
        let filteredOrders = this.mockOrders;
        if (filters?.status) {
          filteredOrders = filteredOrders.filter(o => o.status === filters.status);
        }
        
        const page = filters?.page || 0;
        const size = filters?.size || 10;
        const totalElements = filteredOrders.length;
        const totalPages = Math.ceil(totalElements / size);
        
        const start = page * size;
        const end = start + size;
        const content = filteredOrders.slice(start, end);

        return of({
          content,
          totalElements,
          totalPages,
          pageSize: size,
          pageNumber: page,
          last: page === totalPages - 1 || totalPages === 0
        });
      })
    );
  }

  getOrderDetails(id: number): Observable<AdminOrder> {
    return this.apiService.get<AdminOrder>(API_ENDPOINTS.admin.orderDetail(id)).pipe(
      catchError(error => {
        console.warn(`Backend unavailable or error fetching order ${id}. Using mock data.`, error);
        const order = this.mockOrders.find(o => o.orderId === id);
        if (order) {
          return of(order);
        }
        return throwError(() => new Error('Order not found'));
      })
    );
  }

  updateOrderStatus(id: number, status: 'PLACED' | 'SHIPPED' | 'DELIVERED'): Observable<any> {
    return this.apiService.put<any, { status: string }>(API_ENDPOINTS.admin.orderStatus(id), { status }).pipe(
      catchError(error => {
        console.warn(`Backend unavailable or error updating status for order ${id}. Using mock data.`, error);
        const orderIndex = this.mockOrders.findIndex(o => o.orderId === id);
        if (orderIndex !== -1) {
          this.mockOrders[orderIndex].status = status;
          return of(this.mockOrders[orderIndex]);
        }
        return throwError(() => error);
      })
    );
  }
}
