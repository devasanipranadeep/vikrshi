'use client';

import React, { useState } from 'react';
import { CustomerReview } from '@/types';
import { Star, Trash2, Search, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewsManagerProps {
  reviews: CustomerReview[];
  onReviewUpdated: () => void;
}

export function ReviewsManager({ reviews, onReviewUpdated }: ReviewsManagerProps) {
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  const handleDeleteReview = async (id: string, name: string) => {
    if (!confirm(`Delete review from "${name}"?`)) return;

    try {
      const res = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Review removed');
        onReviewUpdated();
      } else {
        toast.error('Failed to remove review');
      }
    } catch (e) {
      toast.error('Network error deleting review');
    }
  };

  const filtered = reviews.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase());
    const matchRating = ratingFilter === 'all' || r.rating === Number(ratingFilter);
    return matchSearch && matchRating;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-forest-100 shadow-sm">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-950">
            Customer Reviews & Ratings Moderation
          </h2>
          <p className="text-xs sm:text-sm text-forest-600 mt-0.5">
            Monitor real-time feedback from Hyderabad households and manage published testimonials.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-50 border border-gold-200 text-gold-900 text-xs font-bold">
          <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
          <span>{reviews.length} Total Verified Reviews</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by reviewer, locality, text..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', '5', '4', '3'].map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                ratingFilter === r
                  ? 'bg-leaf-700 text-white shadow-xs'
                  : 'bg-white text-forest-700 hover:bg-forest-50 border border-forest-200'
              }`}
            >
              {r === 'all' ? 'All Ratings' : `${r} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-5 border border-forest-100 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-forest-950 text-sm">{rev.name}</span>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-leaf-700 bg-leaf-50 px-2 py-0.5 rounded-full border border-leaf-200">
                        <CheckCircle2 className="w-3 h-3 text-leaf-600" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-forest-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-leaf-600" />
                    <span>{rev.location}</span>
                    <span>•</span>
                    <span>{rev.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 bg-gold-50 px-2 py-1 rounded-lg border border-gold-200">
                  <span className="text-xs font-bold text-gold-900">{rev.rating}</span>
                  <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                </div>
              </div>

              {rev.productName && (
                <div className="text-[11px] text-forest-600 mb-2 font-medium">
                  Item: <span className="font-bold text-forest-800">{rev.productName}</span>
                </div>
              )}

              <h4 className="font-serif font-bold text-forest-900 text-sm mb-1">
                &ldquo;{rev.title}&rdquo;
              </h4>
              <p className="text-xs text-forest-700 leading-relaxed line-clamp-3">
                {rev.comment}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-forest-100 flex items-center justify-between text-xs text-forest-500">
              <span>Helpful votes: {rev.helpfulCount || 0}</span>
              <button
                type="button"
                onClick={() => handleDeleteReview(rev.id, rev.name)}
                className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1 text-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
