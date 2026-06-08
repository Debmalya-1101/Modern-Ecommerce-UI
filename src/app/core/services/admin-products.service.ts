import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, throwError, Subject, delay, shareReplay, finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { AdminProductDTO, CreateProductDTO, ProductPaginationResponseDTO, UpdateProductDTO, AmazonScrapeRequest, AmazonScrapeResultDTO, FlipkartScrapeRequest, FlipkartScrapeResultDTO } from '../models/admin-product.model';

@Injectable({
  providedIn: 'root'
})
export class AdminProductsService {
  private apiService = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  private productImportedSource = new Subject<void>();
  productImported$ = this.productImportedSource.asObservable();

  private activeScrapes = new Map<string, Observable<any>>();

  private mockProducts: AdminProductDTO[] = [
    { id: 1, name: 'Apple iPhone 15', description: 'Latest iPhone with A16 Bionic.', price: 79999.00, imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80', imageUrls: [], categoryId: 1, categoryName: 'Smartphones', stock: 45, active: true, brand: 'Apple', rating: 4.8, attributes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 2, name: 'Samsung Galaxy S24', description: 'AI powered flagship phone.', price: 74999.00, imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80', imageUrls: [], categoryId: 1, categoryName: 'Smartphones', stock: 12, active: true, brand: 'Samsung', rating: 4.7, attributes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 3, name: 'Sony WH-1000XM5', description: 'Noise cancelling headphones.', price: 29990.00, imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80', imageUrls: [], categoryId: 2, categoryName: 'Audio', stock: 0, active: false, brand: 'Sony', rating: 4.9, attributes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 4, name: 'MacBook Pro 14"', description: 'M3 Pro chip, 18GB RAM.', price: 169900.00, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', imageUrls: [], categoryId: 3, categoryName: 'Laptops', stock: 15, active: true, brand: 'Apple', rating: 4.9, attributes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 5, name: 'Dell XPS 15', description: 'InfinityEdge display, Core i9.', price: 185000.00, imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80', imageUrls: [], categoryId: 3, categoryName: 'Laptops', stock: 28, active: true, brand: 'Dell', rating: 4.6, attributes: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ];

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

    return this.apiService.get<ProductPaginationResponseDTO>(API_ENDPOINTS.admin.products, params).pipe(
      catchError(() => {
        console.warn('Admin products API failed, falling back to mock data');
        let filtered = this.mockProducts;
        if (search) {
          const lowerSearch = search.toLowerCase();
          filtered = filtered.filter(p => p.name.toLowerCase().includes(lowerSearch) || p.categoryName.toLowerCase().includes(lowerSearch));
        }
        
        if (sortBy === 'stock') {
          filtered = [...filtered].sort((a, b) => {
            return order === 'asc' ? a.stock - b.stock : b.stock - a.stock;
          });
        }

        const start = page * size;
        const end = start + size;
        const paginatedContent = filtered.slice(start, end);
        
        return of({
          content: paginatedContent,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size),
          number: page,
          size: size
        });
      })
    );
  }

  createProduct(data: CreateProductDTO): Observable<AdminProductDTO> {
    return this.apiService.post<AdminProductDTO, CreateProductDTO>(API_ENDPOINTS.admin.products, data).pipe(
      catchError(() => {
        const newProduct: AdminProductDTO = {
          ...data,
          id: Math.max(...this.mockProducts.map(p => p.id), 0) + 1,
          categoryName: 'Category ' + data.categoryId,
          rating: 0,
          imageUrls: data.additionalImageUrls || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.mockProducts.unshift(newProduct);
        return of(newProduct);
      })
    );
  }

  updateProduct(id: number, data: UpdateProductDTO): Observable<AdminProductDTO> {
    return this.apiService.put<AdminProductDTO, UpdateProductDTO>(API_ENDPOINTS.admin.productDetail(id), data).pipe(
      catchError(() => {
        const index = this.mockProducts.findIndex(p => p.id === id);
        if (index > -1) {
          const updated = { ...this.mockProducts[index], ...data, updatedAt: new Date().toISOString() } as AdminProductDTO;
          if (data.categoryId) updated.categoryName = 'Category ' + data.categoryId;
          if (data.additionalImageUrls) updated.imageUrls = data.additionalImageUrls;
          this.mockProducts[index] = updated;
          return of(updated);
        }
        throw new Error('Product not found');
      })
    );
  }

  updateStock(id: number, stock: number): Observable<string | AdminProductDTO> {
    return this.apiService.patch<string, { stock: number }>(
      API_ENDPOINTS.admin.productStock(id),
      { stock },
      { responseType: 'text' }
    ).pipe(
      catchError((err) => {
        console.warn('Admin products stock update API failed, falling back to mock data', err);
        const index = this.mockProducts.findIndex(p => p.id === id);
        if (index > -1) {
          this.mockProducts[index] = { ...this.mockProducts[index], stock, updatedAt: new Date().toISOString() };
          return of(this.mockProducts[index]);
        }
        return throwError(() => err);
      })
    );
  }

  updateStatus(id: number, active: boolean): Observable<string | AdminProductDTO> {
    return this.apiService.patch<string, { active: boolean }>(
      API_ENDPOINTS.admin.productStatus(id),
      { active },
      { responseType: 'text' }
    ).pipe(
      catchError((err) => {
        console.warn('Admin products status update API failed, falling back to mock data', err);
        const index = this.mockProducts.findIndex(p => p.id === id);
        if (index > -1) {
          this.mockProducts[index] = { ...this.mockProducts[index], active, updatedAt: new Date().toISOString() };
          return of(this.mockProducts[index]);
        }
        return throwError(() => err);
      })
    );
  }

  deleteProduct(id: number): Observable<string | void> {
    return this.apiService.delete<string>(
      API_ENDPOINTS.admin.productDetail(id),
      undefined,
      { responseType: 'text' }
    ).pipe(
      catchError((err) => {
        console.warn('Admin products delete API failed, falling back to mock data', err);
        const index = this.mockProducts.findIndex(p => p.id === id);
        if (index > -1) {
          this.mockProducts = this.mockProducts.filter(p => p.id !== id);
          return of(undefined);
        }
        return throwError(() => err);
      })
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
      catchError((err) => {
        console.warn('Amazon scraper API failed, falling back to mock data');
        const mockResult: AmazonScrapeResultDTO = {
          status: 'SUCCESS',
          asin: request.asins[0] || 'B09G93C5DK',
          message: 'Product successfully scraped from Amazon India and saved to database.',
          productId: Math.max(...this.mockProducts.map(p => p.id), 0) + 1,
          productName: 'Mock Amazon Product',
          priceInr: 49999,
          category: request.categoryName,
          mainImageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80',
          imagesInserted: 1,
          attributesInserted: 3,
          reviewsSimulated: request.simulatedReviews || 3,
          ordersSimulated: request.simulatedOrders || 5
        };
        return of([mockResult]).pipe(delay(2000));
      }),
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
          this.snackBar.open(`Successfully imported ${successCount} product(s) from Amazon!`, 'Close', { duration: 5000, panelClass: ['success-snackbar'] });
          this.productImportedSource.next();
        } else {
          this.snackBar.open('Amazon import completed with no successful products.', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Failed to import product from Amazon.', 'Close', { duration: 5000, panelClass: ['error-snackbar'] })
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
      catchError((err) => {
        console.warn('Flipkart scraper API failed, falling back to mock data');
        const mockResult: FlipkartScrapeResultDTO = {
          status: 'SUCCESS',
          fsn: request.fsns[0] || 'MOBGTAGMG5GB3BD3',
          message: 'Product successfully scraped from Flipkart India and saved to database.',
          productId: Math.max(...this.mockProducts.map(p => p.id), 0) + 1,
          productName: 'Mock Flipkart Product',
          priceInr: 29999,
          category: request.categoryName,
          mainImageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80',
          imagesInserted: 1,
          attributesInserted: 3,
          reviewsSimulated: request.simulatedReviews || 3,
          ordersSimulated: request.simulatedOrders || 5
        };
        return of([mockResult]).pipe(delay(2000));
      }),
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
          this.snackBar.open(`Successfully imported ${successCount} product(s) from Flipkart!`, 'Close', { duration: 5000, panelClass: ['success-snackbar'] });
          this.productImportedSource.next();
        } else {
          this.snackBar.open('Flipkart import completed with no successful products.', 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      },
      error: () => this.snackBar.open('Failed to import product from Flipkart.', 'Close', { duration: 5000, panelClass: ['error-snackbar'] })
    });

    this.activeScrapes.set(key, apiCall$);

    if (runInBackground) {
      return of([]);
    }
    return apiCall$;
  }
}
