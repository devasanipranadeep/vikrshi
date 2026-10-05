'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { galleryService } from '@/services/gallery';
import { SocialPost } from '@/types';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';
import {
  Heart,
  Maximize2,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ShoppingBag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FarmJourneyInstagram() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const fetchLivePosts = useCallback(async () => {
    try {
      const data = await galleryService.getPosts();
      setPosts(data || []);
    } catch {
      // Keep state on network error
    }
  }, []);

  useEffect(() => {
    fetchLivePosts();

    // Automatically refresh whenever an admin adds, edits, or deletes a story
    const unsubscribe = subscribeToStoreUpdates(() => {
      fetchLivePosts();
    }, ['gallery', 'social', 'all']);

    return () => {
      unsubscribe();
    };
  }, [fetchLivePosts]);

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedIndex !== null && posts.length > 0) {
        setSelectedIndex((selectedIndex - 1 + posts.length) % posts.length);
      }
    },
    [selectedIndex, posts.length]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (selectedIndex !== null && posts.length > 0) {
        setSelectedIndex((selectedIndex + 1) % posts.length);
      }
    },
    [selectedIndex, posts.length]
  );

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex, handlePrev, handleNext]);

  if (!posts || posts.length === 0) {
    return null;
  }

  const selectedPost = selectedIndex !== null ? posts[selectedIndex] : null;

  return (
    <section id="gallery" className="py-20 bg-cream-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
              Farm Gallery
            </h2>
            <p className="text-xs sm:text-sm text-forest-700/80 mt-1">
              Live glimpses from our regenerative farm, morning harvests, and dispatch moments.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors self-start md:self-auto shadow-xs"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grid of Dynamic preview cards - 2 per line on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {posts.map((post, index) => {
            return (
              <motion.div
                key={post.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedIndex(index);
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-cream-200 shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-leaf-500"
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-cream-100">
                  <Image
                    src={post.imageUrl}
                    alt={post.caption || 'Vikrshi farm photo'}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                    unoptimized={post.imageUrl.startsWith('data:') || post.imageUrl.includes('supabase.co')}
                  />
                  <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 sm:gap-4 text-white">
                    <span className="flex items-center gap-1 text-xs sm:text-sm font-bold">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 fill-white" />
                      {post.likes}
                    </span>
                    <div className="p-2 rounded-full bg-white/20 backdrop-blur-xs">
                      <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>
                </div>

                {/* Caption / Story Description */}
                {post.caption && (
                  <div className="p-3 bg-white flex-1">
                    <p className="text-xs text-forest-800 line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>
                  </div>
                )}

                {/* Bottom Bar */}
                <div className="p-2.5 sm:p-3 bg-white flex items-center justify-between text-[10px] sm:text-xs border-t border-cream-100">
                  <span className="text-forest-700/70">{post.date || 'Recent'}</span>
                  <span className="text-leaf-700 font-semibold group-hover:text-leaf-800 flex items-center gap-1">
                    <span>View photo</span>
                    <Maximize2 className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Pop-up Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
              className="fixed inset-0 bg-forest-950/85 backdrop-blur-md"
            />

            {/* Navigation buttons for previous / next */}
            {posts.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  aria-label="Previous photo"
                  className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-60 p-2.5 sm:p-3 rounded-full bg-forest-900/80 hover:bg-forest-900 text-white backdrop-blur-sm transition-transform hover:scale-110 shadow-lg cursor-pointer hidden sm:flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next photo"
                  className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-60 p-2.5 sm:p-3 rounded-full bg-forest-900/80 hover:bg-forest-900 text-white backdrop-blur-sm transition-transform hover:scale-110 shadow-lg cursor-pointer hidden sm:flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-cream-200 flex flex-col md:flex-row my-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIndex(null)}
                aria-label="Close photo view"
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-forest-950/60 hover:bg-forest-950 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo Display Area */}
              <div className="relative md:w-3/5 aspect-4/3 md:aspect-auto bg-black flex items-center justify-center min-h-[280px]">
                <Image
                  src={selectedPost.imageUrl}
                  alt={selectedPost.caption || 'Vikrshi farm photo'}
                  fill
                  className="object-contain"
                  priority
                  unoptimized={
                    selectedPost.imageUrl.startsWith('data:') ||
                    selectedPost.imageUrl.includes('supabase.co')
                  }
                />

                {/* Mobile Prev/Next controls overlaid on image */}
                {posts.length > 1 && (
                  <div className="sm:hidden absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                    <button
                      onClick={handlePrev}
                      aria-label="Previous photo"
                      className="p-2 rounded-full bg-forest-950/70 text-white pointer-events-auto"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      aria-label="Next photo"
                      className="p-2 rounded-full bg-forest-950/70 text-white pointer-events-auto"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Photo Details Sidebar */}
              <div className="md:w-2/5 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto bg-cream-50/50">
                <div className="space-y-4">
                  {/* Photo counter */}
                  {posts.length > 1 && selectedIndex !== null && (
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-leaf-700">
                      Photo {selectedIndex + 1} of {posts.length}
                    </span>
                  )}

                  <p className="font-serif text-base sm:text-lg text-forest-950 font-bold leading-snug">
                    {selectedPost.caption || 'Vikrshi Farm Moment'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-forest-600 pt-3 border-t border-cream-200">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-leaf-600" />
                      <span>{selectedPost.date || 'Recent'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-pink-600 font-bold">
                      <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                      <span>{selectedPost.likes || 0} Likes</span>
                    </span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-cream-200 space-y-2.5">
                  <Link
                    href="/shop"
                    onClick={() => setSelectedIndex(null)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-leaf-400" />
                    <span>Order Fresh Products</span>
                  </Link>

                  <button
                    onClick={() => setSelectedIndex(null)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white hover:bg-cream-100 text-forest-900 font-semibold text-xs border border-cream-300 transition-colors cursor-pointer"
                  >
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
