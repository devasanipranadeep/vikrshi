'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { initialReviews } from '@/constants/mockData';
import { getReviews } from '@/services/reviews';
import { CustomerReview } from '@/types';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';
import { Star, Quote, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<CustomerReview[]>(() => initialReviews.slice(0, 4));
  const [totalCount, setTotalCount] = useState<number>(initialReviews.length);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Load reviews dynamically from backend API and keep synced
  const fetchLiveReviews = useCallback(async () => {
    try {
      const data = await getReviews({ sort: 'highest' });
      if (data && data.reviews && data.reviews.length > 0) {
        // Take top 4 highest-rated and recent reviews for the homepage showcase
        setReviews(data.reviews.slice(0, 4));
        setTotalCount(data.stats?.totalReviews || data.reviews.length);
      }
    } catch {
      // Fallback already initialized with initialReviews
    }
  }, []);

  useEffect(() => {
    fetchLiveReviews();

    // Automatically update when reviews are submitted or updated by customers/admins
    const unsubscribe = subscribeToStoreUpdates(() => {
      fetchLiveReviews();
    }, ['reviews', 'all']);

    return () => {
      unsubscribe();
    };
  }, [fetchLiveReviews]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Subscribed to Vikrshi Harvest Bulletin!', {
      description: 'You will receive weekly fresh harvest lists and seasonal availability.',
    });
    setEmail('');
  };

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-cream-100/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-leaf-600 bg-leaf-100/60 px-3 py-1 rounded-full inline-block mb-3">
            Customer Trust
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
            Loved by Conscious Hyderabad Families
          </h2>
          <p className="mt-3 text-sm sm:text-base text-forest-700/80 leading-relaxed">
            Read what doctors, chefs, and health-focused parents have to say about our dawn harvest deliveries.
          </p>
        </div>

        {/* Testimonials Grid - 2 per line on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-16 sm:mb-20">
          {reviews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl bg-white p-3.5 sm:p-5 md:p-6 border border-cream-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating stars & Verified Purchase Tag */}
                <div className="flex items-center justify-between gap-1 mb-2.5 sm:mb-3">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400" />
                    ))}
                  </div>
                  {item.verifiedPurchase && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-semibold text-leaf-700 bg-leaf-50 px-1.5 py-0.5 rounded-full border border-leaf-200/60">
                      <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-leaf-600" />
                      Verified
                    </span>
                  )}
                </div>

                <Quote className="h-5 w-5 sm:h-7 sm:w-7 text-leaf-500/25 mb-1.5 sm:mb-2" />

                {/* Review Headline (Sub-text paragraph removed) */}
                <h4 className="font-serif text-xs sm:text-sm md:text-base font-bold text-forest-950 line-clamp-3 leading-snug">
                  &ldquo;{item.title || item.comment}&rdquo;
                </h4>
              </div>

              {/* Author */}
              <div className="mt-3.5 sm:mt-5 pt-2.5 sm:pt-3 border-t border-cream-100 flex items-center justify-between">
                <div className="truncate">
                  <p className="text-xs sm:text-sm font-bold text-forest-950 truncate">{item.name}</p>
                  <p className="text-[10px] sm:text-xs text-forest-700/70 truncate">{item.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Reviews CTA */}
        <div className="text-center -mt-10 mb-16">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-900 hover:bg-forest-800 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <span>Read All Verified Customer Reviews ({totalCount > 0 ? `${totalCount}+` : '280+'})</span>
            <span className="text-leaf-300">→</span>
          </Link>
        </div>

        {/* Newsletter / Harvest Bulletin Sign Up */}
        <div className="rounded-3xl bg-forest-900 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-leaf-500/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-leaf-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-500/20 px-3.5 py-1 text-xs font-semibold text-leaf-300 border border-leaf-400/20">
              <Sparkles className="h-3.5 w-3.5" />
              Weekly Farm Dispatch Bulletin
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Get Weekly Harvest Schedules & Early Berry Alerts
            </h3>

            <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed max-w-lg mx-auto">
              Know when wild Sitaphal, organic Banganapalli mangoes, or fresh baby spinach arrive before batches sell out. Zero spam, pure farm updates.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2"
            >
              <div className="relative w-full">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-700/60" />
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-white text-forest-950 placeholder:text-forest-700/50 py-3 pl-10 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-leaf-400"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 rounded-xl bg-leaf-500 hover:bg-leaf-600 text-white font-semibold px-6 py-3 text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
              >
                Join Bulletin
              </button>
            </form>

            <p className="text-[11px] text-cream-200/60 pt-1">
              You can unsubscribe anytime with one click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
