import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { ApiService } from './api.service';

export interface ChatRequest {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotApiService {
  private readonly apiService = inject(ApiService);

  sendMessage(message: string): Observable<string> {
    const request: ChatRequest = { message };
    // The backend endpoint returns a plain text string
    return this.apiService.post<string, ChatRequest>(
      API_ENDPOINTS.chatbot, 
      request, 
      { 
        trackLoading: false, 
        responseType: 'text' 
      }
    );
  }
}
