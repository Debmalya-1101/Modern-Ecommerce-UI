import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { Address } from '../models/address.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AddressesApiService {
  private readonly apiService = inject(ApiService);

  getAddresses(): Observable<Address[]> {
    return this.apiService.get<Address[]>(API_ENDPOINTS.addresses.root, undefined, { trackLoading: true });
  }

  createAddress(address: Address): Observable<Address> {
    return this.apiService.post<Address, Address>(API_ENDPOINTS.addresses.root, address, { trackLoading: true });
  }

  updateAddress(id: number, address: Address): Observable<Address> {
    return this.apiService.put<Address, Address>(API_ENDPOINTS.addresses.detail(id), address, undefined, { trackLoading: true });
  }

  deleteAddress(id: number): Observable<string> {
    return this.apiService.delete<string>(API_ENDPOINTS.addresses.detail(id), undefined, { trackLoading: true, responseType: 'text' });
  }

  setDefaultAddress(id: number): Observable<Address> {
    return this.apiService.put<Address, null>(API_ENDPOINTS.addresses.default(id), null, undefined, { trackLoading: true });
  }
}
