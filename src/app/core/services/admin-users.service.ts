import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/api.model';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { AdminUserDTO } from '../models/admin-users.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {
  private readonly apiService = inject(ApiService);

  getUsers(page = 0, size = 10, search?: string, role?: string, active?: boolean): Observable<PageResponse<AdminUserDTO>> {
    const params: Record<string, string | number | boolean> = { page, size };
    if (search) {
      params['search'] = search;
    }
    if (role) {
      params['role'] = role;
    }
    if (active !== undefined) {
      params['active'] = active;
    }
    return this.apiService.get<PageResponse<AdminUserDTO>>(
      API_ENDPOINTS.admin.users.root,
      params,
      { trackLoading: true }
    );
  }

  getUserById(id: number): Observable<AdminUserDTO> {
    return this.apiService.get<AdminUserDTO>(
      API_ENDPOINTS.admin.users.detail(id),
      undefined,
      { trackLoading: true }
    );
  }

  updateUserRole(id: number, role: string): Observable<AdminUserDTO> {
    return this.apiService.put<AdminUserDTO, null>(
      API_ENDPOINTS.admin.users.role(id),
      null,
      { role },
      { trackLoading: true }
    );
  }

  updateUserStatus(id: number, active: boolean): Observable<AdminUserDTO> {
    return this.apiService.put<AdminUserDTO, null>(
      API_ENDPOINTS.admin.users.status(id),
      null,
      { active: active.toString() },
      { trackLoading: true }
    );
  }
}
