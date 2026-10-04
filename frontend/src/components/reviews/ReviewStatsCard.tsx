'use client';

import React from 'react';
import { Star, ShieldCheck, HeartHandshake, Sparkles, PenLine } from 'lucide-react';
import { ReviewStats } from '@/services/reviews';

interface ReviewStatsCardProps {
  stats: ReviewStats;
  selectedRating: string;
  onSelectRating: (rating: string) => void;
  onOpenModal: () => void;
}

export function ReviewStatsCard({
  stats,
  selectedRating,
  onSelectRating,
  onOpenModal,
}: ReviewStatsCardProps) {
  const { averageRating, totalReviews, recommendationRate, distribution } = stats;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-leaf-950/5 border border-forest-100 relative overflow-hidden">
      {/* Decorative farm motif background blur */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-leaf-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-gold-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Big Score & Summary */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-forest-100 pb-8 lg:pb-0 lg:pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-200 text-forest-700 text-xs font-semibold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
            Verified Customer Sentiment
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-6xl font-serif font-bold text-forest-950 tracking-tight">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-forest-600">out of 5.0</span>
              <span className="text-xs text-forest-400">({totalReviews} total reviews)</span>
            </div>
          </div>

          {/* Star Stars */}
          <div className="flex items-center gap-1.5 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(averageRating)
                    ? 'text-gold-500 fill-gold-500'
                    : 'text-forest-200'
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-forest-700 font-medium">
            <strong className="text-forest-900">{recommendationRate}%</strong> of customers recommend Vikrshi Farm harvest to friends & family.
          </p>

          <button
            type="button"
            onClick={onOpenModal}
            className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-forest-900 hover:bg-forest-800 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 group"
          >
            <PenLine className="w-4 h-4 text-leaf-300 group-hover:rotate-12 transition-transform duration-200" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Center: Rating Breakdown Bars */}
        <div className="lg:col-span-5 space-y-2.5">
          <h4 className="text-sm font-semibold text-forest-900 mb-3 flex items-center justify-between">
            <span>Rating Breakdown</span>
            {selectedRating !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectRating('all')}
                className="text-xs text-leaf-700 hover:text-leaf-800 underline font-medium"
              >
                Clear filter
              </button>
            )}
          </h4>

          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            const isSelected = selectedRating === String(stars);

            return (
              <button
                key={stars}
                type="button"
                onClick={() => onSelectRating(isSelected ? 'all' : String(stars))}
                className={`w-full group flex items-center gap-3 text-xs p-1.5 rounded-lg transition-colors text-left ${
                  isSelected ? 'bg-leaf-50 ring-1 ring-leaf-300' : 'hover:bg-forest-50/70'
                }`}
                title={`Filter by ${stars} stars`}
              >
                <div className="flex items-center gap-1 w-14 shrink-0 font-medium text-forest-800">
                  <span>{stars}</span>
                  <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
                </div>

                <div className="flex-1 h-3 bg-forest-100 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stars >= 4
                        ? 'bg-gradient-to-r from-leaf-500 to-leaf-600'
                        : stars === 3
                        ? 'bg-gradient-to-r from-gold-400 to-gold-500'
                        : 'bg-gradient-to-r from-amber-400 to-amber-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="w-14 text-right text-forest-600 font-mono text-[11px] shrink-0">
                  {percentage}% ({count})
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Farm Trust Highlights */}
        <div className="lg:col-span-3 flex flex-col gap-4 bg-forest-50/60 p-5 rounded-2xl border border-forest-100 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-leaf-100 text-leaf-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-leaf-700" />
            </div>
            <div>
              <p className="font-semibold text-forest-900">100% Genuine Buyers</p>
              <p className="text-forest-600 mt-0.5">Reviews submitted by real households across Hyderabad & Telangana.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4 text-gold-700" />
            </div>
            <div>
              <p className="font-semibold text-forest-900">Unfiltered Transparency</p>
              <p className="text-forest-600 mt-0.5">Every comment directly helps our Chevella & Nilgiri farmers improve harvest quality.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
