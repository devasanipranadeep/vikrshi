'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { ReviewsManager } from '@/components/admin/ReviewsManager';
import { CustomerReview } from '@/types';
import { getReviews } from '@/services/reviews';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);

  const loadData = async () => {
    try {
      const data = await getReviews();
      setReviews(data?.reviews || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStoreUpdates(() => loadData());
    return () => unsub();
  }, []);

  return (
    <AdminWrapper activeTab="reviews">
      <ReviewsManager
        reviews={reviews}
        onReviewUpdated={loadData}
      />
    </AdminWrapper>
  );
}
