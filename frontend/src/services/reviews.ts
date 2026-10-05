import { apiClient } from './apiClient';
import { CustomerReview, ReviewSubmissionData } from '@/types';

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  recommendationRate: number;
  distribution: Record<number, number>;
}

export interface ReviewsResponseData {
  reviews: CustomerReview[];
  stats: ReviewStats;
}

export async function getReviews(params?: {
  search?: string;
  rating?: string | number;
  location?: string;
  sort?: string;
}): Promise<ReviewsResponseData> {
  return apiClient<ReviewsResponseData>('/api/reviews', {
    params: {
      search: params?.search,
      rating: params?.rating,
      location: params?.location,
      sort: params?.sort,
    },
    next: { revalidate: 0 },
  });
}

export async function submitReview(data: ReviewSubmissionData): Promise<{ message: string; data: CustomerReview }> {
  const res = await apiClient<any>('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  // apiClient unboxes json.data if present, so res might directly be CustomerReview
  const reviewData: CustomerReview = (res && typeof res.rating === 'number') ? res : (res?.data || res);
  return {
    message: res?.message || 'Thank you for sharing your experience! Your review is now live.',
    data: reviewData,
  };
}

export async function upvoteReview(reviewId: string): Promise<{ helpfulCount: number }> {
  return apiClient<{ helpfulCount: number }>('/api/reviews', {
    method: 'PATCH',
    body: JSON.stringify({ reviewId }),
  });
}
