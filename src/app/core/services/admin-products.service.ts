import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError, Subject, delay, shareReplay, finalize } from 'rxjs';
import { SnackbarService } from '../../shared/services/snackbar.service';

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { AdminProductDTO, CreateProductDTO, ProductPaginationResponseDTO, UpdateProductDTO, AmazonScrapeRequest, AmazonScrapeResultDTO, FlipkartScrapeRequest, FlipkartScrapeResultDTO } from '../models/admin-product.model';

@Injectable({
  providedIn: 'root'
})
export class AdminProductsService {
  private apiService = inject(ApiService);
  private snackbarService = inject(SnackbarService);

  private productImportedSource = new Subject<void>();
  productImported$ = this.productImportedSource.asObservable();

  private activeScrapes = new Map<string, Observable<any>>();



  getProducts(page: number = 0, size: number = 10, search?: string, sortBy?: string, order: string = 'desc'): Observable<ProductPaginationResponseDTO> {
    let params: Record<string, string | number | boolean> = {
      page: page,
      size: size
    };
      
    if (search) {
      params['search'] = search;
    }
    if (sortBy) {
      params['sortBy'] = sortBy;
      params['order'] = order;
    }

    return this.apiService.get<ProductPaginationResponseDTO>(API_ENDPOINTS.admin.products, params);
  }

  createProduct(data: CreateProductDTO): Observable<AdminProductDTO> {
    return this.apiService.post<AdminProductDTO, CreateProductDTO>(API_ENDPOINTS.admin.products, data);
  }

  updateProduct(id: number, data: UpdateProductDTO): Observable<AdminProductDTO> {
    return this.apiService.put<AdminProductDTO, UpdateProductDTO>(API_ENDPOINTS.admin.productDetail(id), data);
  }

  updateStock(id: number, stock: number): Observable<string | AdminProductDTO> {
    return this.apiService.patch<string, { stock: number }>(
      API_ENDPOINTS.admin.productStock(id),
      { stock },
      { responseType: 'text' }
    );
  }

  updateStatus(id: number, active: boolean): Observable<string | AdminProductDTO> {
    return this.apiService.patch<string, { active: boolean }>(
      API_ENDPOINTS.admin.productStatus(id),
      { active },
      { responseType: 'text' }
    );
  }

  deleteProduct(id: number): Observable<string | void> {
    return this.apiService.delete<string>(
      API_ENDPOINTS.admin.productDetail(id),
      undefined,
      { responseType: 'text' }
    );
  }

  scrapeAmazon(request: AmazonScrapeRequest, runInBackground: boolean = false): Observable<AmazonScrapeResultDTO[]> {
    const sortedAsins = [...request.asins].sort().join(',');
    const key = `amazon-${sortedAsins}`;

    if (this.activeScrapes.has(key)) {
      const existing$ = this.activeScrapes.get(key)!;
      if (runInBackground) {
        return of([]);
      }
      return existing$;
    }

    const apiCall$ = this.apiService.post<AmazonScrapeResultDTO[], AmazonScrapeRequest>(API_ENDPOINTS.admin.scraperAmazon, request).pipe(
      finalize(() => {
        this.activeScrapes.delete(key);
      }),
      shareReplay(1)
    );

    // Subscribe once inside the service to prevent request cancellation if dialog closes
    apiCall$.subscribe({
      next: (results) => {
        const successCount = results.filter(r => r.status === 'SUCCESS').length;
        if (successCount > 0) {
          this.snackbarService.success(`Successfully imported ${successCount} product(s) from Amazon!`);
          this.productImportedSource.next();
        } else {
          this.snackbarService.error('Amazon import completed with no successful products.');
        }
      },
      error: () => this.snackbarService.error('Failed to import product from Amazon.')
    });

    this.activeScrapes.set(key, apiCall$);

    if (runInBackground) {
      return of([]);
    }
    return apiCall$;
  }

  scrapeFlipkart(request: FlipkartScrapeRequest, runInBackground: boolean = false): Observable<FlipkartScrapeResultDTO[]> {
    const sortedFsns = [...request.fsns].sort().join(',');
    const key = `flipkart-${sortedFsns}`;

    if (this.activeScrapes.has(key)) {
      const existing$ = this.activeScrapes.get(key)!;
      if (runInBackground) {
        return of([]);
      }
      return existing$;
    }

    const apiCall$ = this.apiService.post<FlipkartScrapeResultDTO[], FlipkartScrapeRequest>(API_ENDPOINTS.admin.scraperFlipkart, request).pipe(
      finalize(() => {
        this.activeScrapes.delete(key);
      }),
      shareReplay(1)
    );

    // Subscribe once inside the service to prevent request cancellation if dialog closes
    apiCall$.subscribe({
      next: (results) => {
        const successCount = results.filter(r => r.status === 'SUCCESS').length;
        if (successCount > 0) {
          this.snackbarService.success(`Successfully imported ${successCount} product(s) from Flipkart!`);
          this.productImportedSource.next();
        } else {
          this.snackbarService.error('Flipkart import completed with no successful products.');
        }
      },
      error: () => this.snackbarService.error('Failed to import product from Flipkart.')
    });

    this.activeScrapes.set(key, apiCall$);

    if (runInBackground) {
      return of([]);
    }
    return apiCall$;
  }
}
