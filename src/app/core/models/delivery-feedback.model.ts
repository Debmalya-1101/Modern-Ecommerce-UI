export interface DeliveryFeedbackRequestDTO {
  rating: number;
  comment?: string;
}

export interface DeliveryFeedbackStatusDTO {
  feedbackSubmitted: boolean;
  rating?: number;
  comment?: string;
}

export interface DeliveryFeedbackResponseDTO {
  id: number;
  orderId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface AdminDeliveryFeedbackResponseDTO {
  id: number;
  orderId: number;
  customerId: number;
  customerUsername: string;
  customerEmail: string;
  deliveryPartnerId: number;
  deliveryPartnerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface DeliveryPartnerRatingSummaryDTO {
  deliveryPartnerId: number;
  averageRating: number;
  totalReviews: number;
}
