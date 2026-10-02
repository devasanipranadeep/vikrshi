'use client';

import React, { useState } from 'react';
import { Star, X, Check, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { ReviewSubmissionData, CustomerReview } from '@/types';
import { submitReview } from '@/services/reviewService';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (newReview: CustomerReview) => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: '1 Star — Disappointed / Quality issues',
  2: '2 Stars — Below expectations',
  3: '3 Stars — Average / Satisfactory produce',
  4: '4 Stars — Very fresh & prompt delivery',
  5: '5 Stars — Outstanding harvest freshness! 🌿',
};

const SUGGESTED_PRODUCTS = [
  'Organic Country Tomatoes',
  'Tender Baby Palak (Spinach)',
  'Crunchy Ooty Carrots',
  'Forest Custard Apple (Sitaphal)',
  'Desi Small Bitter Gourd',
  'Aromatic Herb Duo (Coriander & Pudina)',
  'Farm Harvest Vegetable Box',
];

export function ReviewModal({ isOpen, onClose, onReviewSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [productName, setProductName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please provide your name (at least 2 characters).');
      return;
    }

    if (!location.trim() || location.trim().length < 2) {
      setErrorMsg('Please specify your locality/area in Hyderabad or Telangana.');
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      setErrorMsg('Please enter a brief headline for your review.');
      return;
    }

    if (!comment.trim() || comment.trim().length < 10) {
      setErrorMsg('Please write at least 10 characters detailing your experience with our farm produce.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: ReviewSubmissionData = {
        name: name.trim(),
        location: location.trim(),
        rating,
        title: title.trim(),
        comment: comment.trim(),
        productName: productName.trim() || undefined,
      };

      const res = await submitReview(payload);
      setIsSuccess(true);
      onReviewSubmitted(res.data);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset form
        setName('');
        setLocation('');
        setProductName('');
        setTitle('');
        setComment('');
        setRating(5);
      }, 1400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-forest-950/70 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-forest-100 p-6 sm:p-8 text-forest-900">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-forest-400 hover:text-forest-800 hover:bg-forest-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-leaf-100 text-leaf-700 mx-auto flex items-center justify-center animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-forest-950">Thank You, {name}!</h3>
            <p className="text-forest-600 text-sm max-w-sm mx-auto">
              Your review is now live! Our farm team and Hyderabad neighbors appreciate your feedback.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-50 border border-leaf-200 text-leaf-800 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-leaf-600" />
                Customer Voice
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                Share Your Experience
              </h2>
              <p className="text-xs sm:text-sm text-forest-600 mt-1">
                Tell us how our morning harvest tasted on your dining table.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating Star Picker */}
              <div className="bg-forest-50/70 p-4 rounded-2xl border border-forest-100 text-center">
                <label className="block text-xs font-semibold text-forest-800 uppercase tracking-wider mb-2">
                  Your Overall Rating
                </label>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 transition-transform hover:scale-110 active:scale-95"
                      aria-label={`${star} star`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= activeRating
                            ? 'text-gold-500 fill-gold-500'
                            : 'text-forest-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-medium text-forest-700 transition-all">
                  {RATING_DESCRIPTIONS[activeRating]}
                </p>
              </div>

              {/* Name & Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Your Full Name <span className="text-leaf-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Radhika Rao"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">
                    Delivery Locality / City <span className="text-leaf-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Jubilee Hills, Hyderabad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-600"
                  />
                </div>
              </div>

              {/* Product selection (optional) */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">
                  Product / Item Reviewed <span className="text-forest-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Tender Baby Palak (Spinach)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-600 mb-2"
                />

                {/* Quick chip suggestions */}
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_PRODUCTS.map((prod) => (
                    <button
                      key={prod}
                      type="button"
                      onClick={() => setProductName(prod)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                        productName === prod
                          ? 'bg-leaf-700 text-white border-leaf-700'
                          : 'bg-white text-forest-700 border-forest-200 hover:bg-forest-50'
                      }`}
                    >
                      {prod}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">
                  Review Headline <span className="text-leaf-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The sweetest custard apples we've tasted in years!"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-600"
                />
              </div>

              {/* Detailed Experience */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-forest-800">
                    Your Review Story <span className="text-leaf-600">*</span>
                  </label>
                  <span className="text-[11px] text-forest-400">{comment.length}/1000</span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe the freshness, taste, early morning doorstep delivery, or packaging..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-600 resize-none"
                />
              </div>

              {/* Trust statement */}
              <div className="flex items-center gap-2 text-[11px] text-forest-600 bg-forest-50/60 p-2.5 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-leaf-600 shrink-0" />
                <span>By submitting, you confirm you are sharing genuine, firsthand experience with Vikrshi farm produce.</span>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-forest-200 text-forest-700 text-sm font-medium hover:bg-forest-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-white text-sm font-medium transition-all shadow-md active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Submit Review</span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
