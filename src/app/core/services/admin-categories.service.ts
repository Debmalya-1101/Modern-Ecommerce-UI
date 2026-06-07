import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { AdminAttributeKeyDTO, CategoryDTO, CreateAttributeKeyRequest, CreateCategoryRequest } from '../models/admin-category.model';

@Injectable({
  providedIn: 'root'
})
export class AdminCategoriesService {
  private apiService = inject(ApiService);

  private mockCategories: CategoryDTO[] = [
    {
      id: 1,
      name: 'Smartphones',
      attributeKeys: [
        { id: 1, keyName: 'RAM', type: 'TEXT', categoryId: 1, categoryName: 'Smartphones' },
        { id: 2, keyName: 'Storage', type: 'TEXT', categoryId: 1, categoryName: 'Smartphones' },
        { id: 3, keyName: 'Battery', type: 'NUMBER', categoryId: 1, categoryName: 'Smartphones' }
      ]
    },
    {
      id: 2,
      name: 'Laptops',
      attributeKeys: [
        { id: 4, keyName: 'Processor', type: 'TEXT', categoryId: 2, categoryName: 'Laptops' },
        { id: 5, keyName: 'RAM', type: 'TEXT', categoryId: 2, categoryName: 'Laptops' },
        { id: 6, keyName: 'Storage', type: 'TEXT', categoryId: 2, categoryName: 'Laptops' }
      ]
    },
    {
      id: 3,
      name: 'Audio',
      attributeKeys: [
        { id: 7, keyName: 'Type', type: 'TEXT', categoryId: 3, categoryName: 'Audio' },
        { id: 8, keyName: 'Wireless', type: 'TEXT', categoryId: 3, categoryName: 'Audio' }
      ]
    }
  ];

  // Categories CRUD
  getCategories(): Observable<CategoryDTO[]> {
    return this.apiService.get<CategoryDTO[]>(API_ENDPOINTS.admin.categories).pipe(
      catchError(() => {
        console.warn('Admin categories API failed, falling back to mock data');
        return of([...this.mockCategories]);
      })
    );
  }

  getCategory(id: number): Observable<CategoryDTO> {
    return this.apiService.get<CategoryDTO>(API_ENDPOINTS.admin.categoryDetail(id)).pipe(
      catchError(() => {
        const cat = this.mockCategories.find(c => c.id === id);
        if (cat) return of(cat);
        throw new Error('Category not found');
      })
    );
  }

  createCategory(request: CreateCategoryRequest): Observable<CategoryDTO> {
    return this.apiService.post<CategoryDTO, CreateCategoryRequest>(API_ENDPOINTS.admin.categories, request).pipe(
      catchError(() => {
        const newCat: CategoryDTO = {
          id: Math.max(...this.mockCategories.map(c => c.id), 0) + 1,
          name: request.name,
          attributeKeys: []
        };
        this.mockCategories.push(newCat);
        return of(newCat);
      })
    );
  }

  updateCategory(id: number, request: CreateCategoryRequest): Observable<CategoryDTO> {
    return this.apiService.put<CategoryDTO, CreateCategoryRequest>(API_ENDPOINTS.admin.categoryDetail(id), request).pipe(
      catchError(() => {
        const index = this.mockCategories.findIndex(c => c.id === id);
        if (index > -1) {
          this.mockCategories[index] = { ...this.mockCategories[index], name: request.name };
          // Also update categoryName in attribute keys
          this.mockCategories[index].attributeKeys.forEach(k => k.categoryName = request.name);
          return of(this.mockCategories[index]);
        }
        throw new Error('Category not found');
      })
    );
  }

  deleteCategory(id: number): Observable<string | void> {
    return this.apiService.delete<string>(
      API_ENDPOINTS.admin.categoryDetail(id),
      undefined,
      { responseType: 'text' }
    ).pipe(
      catchError((err) => {
        console.warn('Admin categories delete API failed, falling back to mock data', err);
        const index = this.mockCategories.findIndex(c => c.id === id);
        if (index > -1) {
          this.mockCategories = this.mockCategories.filter(c => c.id !== id);
          return of(undefined);
        }
        return throwError(() => err);
      })
    );
  }

  // Attribute Keys CRUD
  getAttributeKeys(categoryId?: number): Observable<AdminAttributeKeyDTO[]> {
    const params = categoryId ? { categoryId } : undefined;
    return this.apiService.get<AdminAttributeKeyDTO[]>(API_ENDPOINTS.admin.attributeKeys, params).pipe(
      catchError(() => {
        let allKeys = this.mockCategories.flatMap(c => c.attributeKeys);
        if (categoryId) {
          allKeys = allKeys.filter(k => k.categoryId === categoryId);
        }
        return of(allKeys);
      })
    );
  }

  createAttributeKey(request: CreateAttributeKeyRequest): Observable<AdminAttributeKeyDTO> {
    return this.apiService.post<AdminAttributeKeyDTO, CreateAttributeKeyRequest>(API_ENDPOINTS.admin.attributeKeys, request).pipe(
      catchError(() => {
        const cat = this.mockCategories.find(c => c.id === request.categoryId);
        if (!cat) throw new Error('Category not found');

        const allKeys = this.mockCategories.flatMap(c => c.attributeKeys);
        const newKey: AdminAttributeKeyDTO = {
          id: Math.max(...allKeys.map(k => k.id), 0) + 1,
          keyName: request.keyName,
          type: request.type,
          categoryId: request.categoryId,
          categoryName: cat.name
        };
        cat.attributeKeys.push(newKey);
        return of(newKey);
      })
    );
  }

  updateAttributeKey(id: number, request: CreateAttributeKeyRequest): Observable<AdminAttributeKeyDTO> {
    return this.apiService.put<AdminAttributeKeyDTO, CreateAttributeKeyRequest>(API_ENDPOINTS.admin.attributeKeyDetail(id), request).pipe(
      catchError(() => {
        let foundKey: AdminAttributeKeyDTO | undefined;
        let foundCat: CategoryDTO | undefined;
        
        for (const cat of this.mockCategories) {
          const index = cat.attributeKeys.findIndex(k => k.id === id);
          if (index > -1) {
            foundKey = cat.attributeKeys[index];
            foundCat = cat;
            
            // Note: If categoryId changed, we'd have to move it to another category's array.
            // For mock simplicity, just update fields.
            foundKey.keyName = request.keyName;
            foundKey.type = request.type;
            break;
          }
        }
        
        if (foundKey) return of(foundKey);
        throw new Error('Attribute key not found');
      })
    );
  }

  deleteAttributeKey(id: number): Observable<string | void> {
    return this.apiService.delete<string>(
      API_ENDPOINTS.admin.attributeKeyDetail(id),
      undefined,
      { responseType: 'text' }
    ).pipe(
      catchError((err) => {
        console.warn('Admin attribute key delete API failed, falling back to mock data', err);
        let found = false;
        for (const cat of this.mockCategories) {
          const originalLength = cat.attributeKeys.length;
          cat.attributeKeys = cat.attributeKeys.filter(k => k.id !== id);
          if (cat.attributeKeys.length !== originalLength) {
            found = true;
          }
        }
        if (found) {
          return of(undefined);
        }
        return throwError(() => err);
      })
    );
  }
}
