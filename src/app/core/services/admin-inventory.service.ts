import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { PageResponse } from '../models/api.model';
import {
  InventoryResponseDTO,
  InventoryTransactionDTO,
  InventoryAdjustmentRequest,
  InventoryAnalyticsDashboardDTO
} from '../models/admin-inventory.model';

@Injectable({
  providedIn: 'root'
})
export class AdminInventoryService {
  private readonly apiService = inject(ApiService);
  private readonly basePath = '/api/admin/inventory';

  getInventoryList(params: {
    page?: number;
    size?: number;
    productId?: number;
    productName?: string;
    lowStock?: boolean;
    outOfStock?: boolean;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }): Observable<PageResponse<InventoryResponseDTO>> {
    const queryParams: Record<string, any> = {};
    
    if (params.page !== undefined) queryParams['page'] = params.page;
    if (params.size !== undefined) queryParams['size'] = params.size;
    if (params.productId !== undefined) queryParams['productId'] = params.productId;
    if (params.productName) queryParams['productName'] = params.productName;
    if (params.lowStock !== undefined) queryParams['lowStock'] = params.lowStock;
    if (params.outOfStock !== undefined) queryParams['outOfStock'] = params.outOfStock;
    if (params.sortBy) queryParams['sortBy'] = params.sortBy;
    if (params.order) queryParams['order'] = params.order;

    return this.apiService.get<PageResponse<InventoryResponseDTO>>(this.basePath, queryParams);
  }

  getInventoryForProduct(productId: number): Observable<InventoryResponseDTO> {
    return this.apiService.get<InventoryResponseDTO>(`${this.basePath}/product/${productId}`);
  }

  getInventoryTransactions(
    inventoryId: number,
    params: {
      page?: number;
      size?: number;
      transactionType?: string;
      referenceType?: string;
      referenceId?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Observable<PageResponse<InventoryTransactionDTO>> {
    const queryParams: Record<string, any> = {};
    
    if (params.page !== undefined) queryParams['page'] = params.page;
    if (params.size !== undefined) queryParams['size'] = params.size;
    if (params.transactionType) queryParams['transactionType'] = params.transactionType;
    if (params.referenceType) queryParams['referenceType'] = params.referenceType;
    if (params.referenceId) queryParams['referenceId'] = params.referenceId;
    if (params.startDate) queryParams['startDate'] = params.startDate;
    if (params.endDate) queryParams['endDate'] = params.endDate;

    return this.apiService.get<PageResponse<InventoryTransactionDTO>>(
      `${this.basePath}/${inventoryId}/transactions`,
      queryParams
    );
  }

  adjustInventory(productId: number, request: InventoryAdjustmentRequest): Observable<InventoryResponseDTO> {
    return this.apiService.post<InventoryResponseDTO, InventoryAdjustmentRequest>(
      `${this.basePath}/product/${productId}/adjust`,
      request
    );
  }

  getInventoryAnalytics(): Observable<InventoryAnalyticsDashboardDTO> {
    return this.apiService.get<InventoryAnalyticsDashboardDTO>(`${this.basePath}/analytics`);
  }
}
