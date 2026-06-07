import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../config/api-endpoints.constants';
import { PageResponse } from '../models/api.model';
import { CreateReviewRequest, ReviewDTO, UpdateReviewRequest } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewsApiService {
  private readonly apiService = inject(ApiService);

  getProductReviews(productId: number, page = 0, size = 10): Observable<PageResponse<ReviewDTO>> {
    return this.apiService.get<PageResponse<ReviewDTO>>(
      API_ENDPOINTS.reviews.product(productId),
      { page, size },
      { trackLoading: true }
    );
  }

  createReview(request: CreateReviewRequest): Observable<ReviewDTO> {
    return this.apiService.post<ReviewDTO, CreateReviewRequest>(
      API_ENDPOINTS.reviews.root,
      request,
      { trackLoading: true }
    );
  }

  updateReview(reviewId: number, request: UpdateReviewRequest): Observable<ReviewDTO> {
    return this.apiService.put<ReviewDTO, UpdateReviewRequest>(
      API_ENDPOINTS.reviews.detail(reviewId),
      request,
      undefined,
      { trackLoading: true }
    );
  }

  deleteReview(reviewId: number): Observable<string> {
    return this.apiService.delete<string>(
      API_ENDPOINTS.reviews.detail(reviewId),
      undefined,
      { trackLoading: true, responseType: 'text' }
    );
  }
}
