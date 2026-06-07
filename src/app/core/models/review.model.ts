export interface ReviewDTO {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number; // 1 to 5
  reviewText: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  reviewText: string;
}

export interface UpdateReviewRequest {
  rating: number;
  reviewText: string;
}
