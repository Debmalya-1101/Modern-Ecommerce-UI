import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { AdminAttributeKeyDTO, CategoryDTO, CreateAttributeKeyRequest, CreateCategoryRequest } from '../models/admin-category.model';

@Injectable({
  providedIn: 'root'
})
export class AdminCategoriesService {
  private apiService = inject(ApiService);

  // Categories CRUD
  getCategories(): Observable<CategoryDTO[]> {
    return this.apiService.get<CategoryDTO[]>(API_ENDPOINTS.admin.categories);
  }

  getCategory(id: number): Observable<CategoryDTO> {
    return this.apiService.get<CategoryDTO>(API_ENDPOINTS.admin.categoryDetail(id));
  }

  createCategory(request: CreateCategoryRequest): Observable<CategoryDTO> {
    return this.apiService.post<CategoryDTO, CreateCategoryRequest>(API_ENDPOINTS.admin.categories, request);
  }

  updateCategory(id: number, request: CreateCategoryRequest): Observable<CategoryDTO> {
    return this.apiService.put<CategoryDTO, CreateCategoryRequest>(API_ENDPOINTS.admin.categoryDetail(id), request);
  }

  deleteCategory(id: number): Observable<string | void> {
    return this.apiService.delete<string>(
      API_ENDPOINTS.admin.categoryDetail(id),
      undefined,
      { responseType: 'text' }
    );
  }

  // Attribute Keys CRUD
  getAttributeKeys(categoryId?: number): Observable<AdminAttributeKeyDTO[]> {
    const params = categoryId ? { categoryId } : undefined;
    return this.apiService.get<AdminAttributeKeyDTO[]>(API_ENDPOINTS.admin.attributeKeys, params);
  }

  createAttributeKey(request: CreateAttributeKeyRequest): Observable<AdminAttributeKeyDTO> {
    return this.apiService.post<AdminAttributeKeyDTO, CreateAttributeKeyRequest>(API_ENDPOINTS.admin.attributeKeys, request);
  }

  updateAttributeKey(id: number, request: CreateAttributeKeyRequest): Observable<AdminAttributeKeyDTO> {
    return this.apiService.put<AdminAttributeKeyDTO, CreateAttributeKeyRequest>(API_ENDPOINTS.admin.attributeKeyDetail(id), request);
  }

  deleteAttributeKey(id: number): Observable<string | void> {
    return this.apiService.delete<string>(
      API_ENDPOINTS.admin.attributeKeyDetail(id),
      undefined,
      { responseType: 'text' }
    );
  }
}
