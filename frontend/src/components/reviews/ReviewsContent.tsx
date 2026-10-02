'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  PenLine,
  Star,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { CustomerReview } from '@/types';
import { ReviewStats } from '@/services/reviewService';
import { ReviewStatsCard } from './ReviewStatsCard';
import { ReviewCard } from './ReviewCard';
import { ReviewModal } from './ReviewModal';

interface ReviewsContentProps {
  initialReviews: CustomerReview[];
  initialStats: ReviewStats;
}

const POPULAR_LOCATIONS = [
  'All Locations',
  'Jubilee Hills',
  'Gachibowli',
  'Banjara Hills',
  'Kondapur',
  'Hitec City',
  'Secunderabad',
  'Tellapur',
  'Financial District',
];

export function ReviewsContent({ initialReviews, initialStats }: ReviewsContentProps) {
  const [reviews, setReviews] = useState<CustomerReview[]>(initialReviews);
  const [stats, setStats] = useState<ReviewStats>(initialStats);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Compute live stats when reviews change
  const currentStats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return stats;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / total).toFixed(1));
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      dist[star] = (dist[star] || 0) + 1;
    });
    const recRate = Math.round((reviews.filter((r) => r.rating >= 4).length / total) * 100);

    return {
      totalReviews: total,
      averageRating: avg,
      recommendationRate: recRate,
      distribution: dist,
    };
  }, [reviews, stats]);

  // Filtered & sorted reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((review) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = review.name.toLowerCase().includes(q);
          const matchTitle = review.title.toLowerCase().includes(q);
          const matchComment = review.comment.toLowerCase().includes(q);
          const matchLoc = review.location.toLowerCase().includes(q);
          const matchProd = review.productName?.toLowerCase().includes(q);
          if (!matchName && !matchTitle && !matchComment && !matchLoc && !matchProd) {
            return false;
          }
        }

        // Rating filter
        if (selectedRating !== 'all') {
          if (review.rating !== Number(selectedRating)) {
            return false;
          }
        }

        // Location filter
        if (selectedLocation !== 'All Locations') {
          if (!review.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'highest') {
          return b.rating - a.rating || (b.helpfulCount || 0) - (a.helpfulCount || 0);
        }
        if (sortBy === 'lowest') {
          return a.rating - b.rating;
        }
        if (sortBy === 'most_helpful') {
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        }
        // default newest
        return 0;
      });
  }, [reviews, searchQuery, selectedRating, selectedLocation, sortBy]);

  const handleReviewSubmitted = (newReview: CustomerReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedRating('all');
    setSelectedLocation('All Locations');
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedRating !== 'all' ||
    selectedLocation !== 'All Locations' ||
    sortBy !== 'newest';

  return (
    <div className="space-y-10">
      {/* 1. Overall Stats Hero Card */}
      <ReviewStatsCard
        stats={currentStats}
        selectedRating={selectedRating}
        onSelectRating={(r) => setSelectedRating(r)}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {/* 2. Filter & Controls Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-forest-100 flex flex-col gap-4">
        {/* Top row: Search + Sort + Write review button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, crop name (palak, carrots), or neighborhood..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-600 bg-forest-50/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-forest-400 hover:text-forest-700 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-forest-50/70 border border-forest-200 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-forest-800">
              <SlidersHorizontal className="w-3.5 h-3.5 text-leaf-600 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="most_helpful">Most Helpful</option>
              </select>
            </div>

            {/* Quick Write Review button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95 shrink-0"
            >
              <PenLine className="w-3.5 h-3.5 text-leaf-300" />
              <span className="hidden sm:inline">Write Review</span>
              <span className="sm:hidden">Review</span>
            </button>
          </div>
        </div>

        {/* Bottom row: Filter Chips (Ratings & Locations) */}
        <div className="pt-3 border-t border-forest-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Rating filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-forest-500 font-medium mr-1 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3 text-leaf-600" /> Stars:
            </span>
            {['all', '5', '4', '3'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRating(r)}
                className={`px-3 py-1.5 rounded-full transition-colors font-medium shrink-0 ${
                  selectedRating === r
                    ? 'bg-leaf-700 text-white shadow-xs'
                    : 'bg-forest-50 text-forest-700 hover:bg-forest-100 border border-forest-200/60'
                }`}
              >
                {r === 'all' ? 'All Stars' : `${r} ★ Stars`}
              </button>
            ))}
          </div>

          {/* Location filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-forest-500 font-medium mr-1 shrink-0 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-leaf-600" /> Locality:
            </span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-forest-200 bg-forest-50/50 text-forest-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-leaf-500"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="ml-2 text-leaf-700 hover:text-leaf-900 underline font-semibold flex items-center gap-1 shrink-0"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Results count summary */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-forest-600 px-1">
        <span>
          Showing <strong className="text-forest-900">{filteredReviews.length}</strong> verified reviews
          {selectedRating !== 'all' && ` with ${selectedRating} stars`}
          {selectedLocation !== 'All Locations' && ` in ${selectedLocation}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-leaf-700 hover:underline font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* 4. Reviews Grid */}
      {filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-forest-100 space-y-4">
          <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8 text-forest-300" />
          </div>
          <h3 className="font-serif text-xl font-bold text-forest-950">
            No reviews match your filters
          </h3>
          <p className="text-sm text-forest-600 max-w-md mx-auto">
            Try resetting your search query or selecting a different rating/locality filter.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-5 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-white text-xs sm:text-sm font-medium transition-all"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-full border border-forest-200 text-forest-800 hover:bg-forest-50 text-xs sm:text-sm font-medium transition-all"
            >
              Be First to Review This
            </button>
          </div>
        </div>
      )}

      {/* 5. Trust Guarantee Footer Strip */}
      <div className="bg-gradient-to-br from-forest-900 to-forest-950 text-cream-100 rounded-3xl p-8 sm:p-10 border border-forest-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/20 text-leaf-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Our Quality Promise
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">
            Not completely delighted with your harvest?
          </h3>
          <p className="text-cream-200/80 text-sm leading-relaxed">
            If any fruit or vegetable doesn't meet your standard of peak freshness, message our WhatsApp helpline within 24 hours of delivery for an instant replacement or refund.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-leaf-500 hover:bg-leaf-400 text-forest-950 font-semibold text-sm transition-all shadow-lg active:scale-95 shrink-0"
        >
          <PenLine className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
