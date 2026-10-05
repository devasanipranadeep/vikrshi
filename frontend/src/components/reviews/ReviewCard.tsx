'use client';

import React, { useState } from 'react';
import { Star, MapPin, CheckCircle, ThumbsUp, Sparkles } from 'lucide-react';
import { CustomerReview } from '@/types';
import { upvoteReview } from '@/services/reviews';

interface ReviewCardProps {
  review: CustomerReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);

  const handleHelpfulClick = async () => {
    if (hasVoted || isSubmittingVote) return;
    setIsSubmittingVote(true);
    setHasVoted(true);
    setHelpfulCount((prev) => prev + 1);

    try {
      await upvoteReview(review.id);
    } catch (e) {
      // optimistic UI retains count
    } finally {
      setIsSubmittingVote(false);
    }
  };

  // Get initials for avatar if no image
  const initials = review.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <article className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow duration-300 border border-forest-100/80 flex flex-col justify-between h-full relative group">
      <div>
        {/* Top Header: Author, Location, Date & Rating */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-leaf-100 text-leaf-800 font-serif font-bold text-sm flex items-center justify-center border border-leaf-200 shadow-xs">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-forest-950 text-base leading-tight">
                  {review.name}
                </h3>
                {review.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-leaf-50 text-leaf-800 border border-leaf-200 text-[11px] font-medium">
                    <CheckCircle className="w-3 h-3 text-leaf-600 fill-leaf-100" />
                    Verified Delivery
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-forest-500 mt-1">
                <MapPin className="w-3 h-3 text-leaf-600 shrink-0" />
                <span>{review.location}</span>
                <span className="text-forest-300">•</span>
                <span>{review.date}</span>
              </div>
            </div>
          </div>

          {/* Star Rating Badge */}
          <div className="flex items-center gap-1 bg-amber-50/80 px-2.5 py-1 rounded-full border border-amber-200/80 shrink-0">
            <span className="text-xs font-bold text-amber-900">{review.rating}.0</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < review.rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-forest-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Tag if provided */}
        {review.productName && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-forest-50 border border-forest-200/70 text-forest-700 text-xs font-medium">
              <Sparkles className="w-3 h-3 text-leaf-600" />
              Reviewed item: <strong className="text-forest-900 font-semibold">{review.productName}</strong>
            </span>
          </div>
        )}

        {/* Review Title */}
        <h4 className="font-serif text-lg font-bold text-forest-900 mb-2 leading-snug">
          &ldquo;{review.title}&rdquo;
        </h4>

        {/* Review Comment */}
        <p className="text-forest-700 text-sm leading-relaxed whitespace-pre-line">
          {review.comment}
        </p>
      </div>

      {/* Card Footer: Helpful button */}
      <div className="mt-6 pt-4 border-t border-forest-100 flex items-center justify-between text-xs text-forest-500">
        <span className="italic">Direct feedback from household</span>

        <button
          type="button"
          onClick={handleHelpfulClick}
          disabled={hasVoted}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
            hasVoted
              ? 'bg-leaf-100 text-leaf-800 font-medium cursor-default'
              : 'bg-forest-50 hover:bg-forest-100 text-forest-700 active:scale-95'
          }`}
          title={hasVoted ? 'Thank you for your feedback' : 'Mark this review as helpful'}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'text-leaf-700 fill-leaf-700' : 'text-forest-500'}`} />
          <span>{hasVoted ? 'Helpful' : 'Helpful?'}</span>
          <span className="font-semibold text-forest-800">({helpfulCount})</span>
        </button>
      </div>
    </article>
  );
}
