'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Heart,
  Calendar,
  X,
  Share2,
  Sparkles,
  ShoppingBag,
  Users2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { SocialPost } from '@/types';
import { galleryService } from '@/services/gallery';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';
import { toast } from 'sonner';

export function GalleryClient() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<SocialPost | null>(null);

  const fetchPosts = React.useCallback(async () => {
    try {
      const data = await galleryService.getPosts();
      if (Array.isArray(data)) {
        setPosts(data.filter((p) => p.isActive !== false));
      }
    } catch (err) {
      console.warn('Could not load gallery posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();

    const unsubscribe = subscribeToStoreUpdates(() => {
      fetchPosts();
    }, ['gallery', 'social', 'all']);

    return () => {
      unsubscribe();
    };
  }, [fetchPosts]);

  const handleShare = (item: SocialPost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: 'Vikrshi Farm Gallery',
          text: item.caption,
          url: shareUrl,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Gallery link copied to clipboard!');
      }
    }
  };

  const handleOpenCommunityPopup = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-community-modal'));
    }
  };

  return (
    <div className="min-h-screen bg-cream-50/60 text-forest-950 font-sans pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-forest-950 text-white pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <Image
            src="/background.png"
            alt="Farm landscape"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-leaf-300 text-xs font-semibold mb-5 shadow-xs"
          >
            <Camera className="w-4 h-4 text-leaf-400" />
            <span>Farm Journal & Live Moments</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-sm leading-tight"
          >
            From Living Soil to Hyderabad Kitchens
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-cream-200/90 max-w-2xl mx-auto leading-relaxed"
          >
            A visual chronicle of regenerative bio-culture farming, sunrise harvests, trusted smallholder farmer partners, and daily morning deliveries.
          </motion.p>

          {/* Quick Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8 text-xs font-medium text-cream-100"
          >
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              🌱 100% Zero-Chemical Soil
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              ☀️ Dawn Harvest Protocol
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
              🚚 12-Hour Farm to Community
            </span>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-20">
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-leaf-600 mb-3" />
            <p className="text-xs text-forest-600 font-medium">Loading farm gallery...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-cream-200/90 shadow-sm max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-4 text-forest-400">
              <Camera className="w-8 h-8 text-forest-400" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest-950 mb-2">
              No Gallery Photos Yet
            </h3>
            <p className="text-xs sm:text-sm text-forest-600 mb-6 leading-relaxed">
              Moments from our Telangana fields, dawn harvests, and morning dispatches will be published here shortly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-leaf-400" />
                <span>Explore Farm Shop</span>
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-900 font-semibold text-xs border border-cream-200 transition-colors"
              >
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
            <AnimatePresence mode="popLayout">
              {posts.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  onClick={() => setSelectedImage(item)}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-cream-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-forest-900/10">
                    <Image
                      src={item.imageUrl}
                      alt={item.caption}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-forest-950/15 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Bottom Image Overlay Details */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white/90 text-xs">
                      <span className="flex items-center gap-1.5 text-[11px] font-medium text-cream-100">
                        <Calendar className="w-3 h-3 text-leaf-400" />
                        <span>{item.date || 'Recent'}</span>
                      </span>

                      <span className="flex items-center gap-1 text-[11px] font-semibold text-white bg-forest-900/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                        <span>{item.likes || 0}</span>
                      </span>
                    </div>
                  </div>

                  {/* Caption / Card Footer */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <p className="text-xs sm:text-sm text-forest-800 line-clamp-3 leading-relaxed font-normal">
                      {item.caption}
                    </p>

                    <div className="mt-3.5 pt-3 border-t border-cream-100 flex items-center justify-between text-xs">
                      <span className="text-leaf-700 font-semibold group-hover:text-leaf-800 inline-flex items-center gap-1 transition-colors">
                        <span>View details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>

                      <button
                        onClick={(e) => handleShare(item, e)}
                        aria-label="Share photo"
                        className="p-1.5 rounded-lg text-forest-500 hover:text-forest-950 hover:bg-cream-100 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-forest-950/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-cream-200 flex flex-col md:flex-row my-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                aria-label="Close photo view"
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-forest-950/60 hover:bg-forest-950 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Image */}
              <div className="relative md:w-3/5 aspect-4/3 md:aspect-auto bg-black flex items-center justify-center min-h-[280px]">
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.caption}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Modal Details */}
              <div className="md:w-2/5 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto bg-cream-50/50">
                <div className="space-y-4">
                  <p className="font-serif text-base sm:text-lg text-forest-950 font-bold leading-snug">
                    {selectedImage.caption}
                  </p>

                  <div className="flex items-center justify-between text-xs text-forest-600 pt-2 border-t border-cream-200">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-leaf-600" />
                      <span>{selectedImage.date || 'Recent'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-pink-600 font-bold">
                      <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                      <span>{selectedImage.likes || 0} Likes</span>
                    </span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-cream-200 space-y-2.5">
                  <Link
                    href="/shop"
                    onClick={() => setSelectedImage(null)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-leaf-400" />
                    <span>Order Fresh Products</span>
                  </Link>

                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      handleOpenCommunityPopup();
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white hover:bg-cream-100 text-forest-900 font-semibold text-xs border border-cream-300 transition-colors cursor-pointer"
                  >
                    <Users2 className="w-4 h-4 text-leaf-600" />
                    <span>Request Community Delivery</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Community Supply Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-20">
        <div className="relative rounded-3xl bg-forest-950 text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-forest-800">
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-leaf-500/20 text-leaf-300 border border-leaf-500/30 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Direct Farm Connection
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Want These Harvests Delivered to Your Society?
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-cream-200/80 leading-relaxed">
              We organize scheduled morning delivery routes and weekly farm harvest pop-up tables for gated communities and apartments across Hyderabad.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleOpenCommunityPopup}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-leaf-500 hover:bg-leaf-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Users2 className="w-4 h-4" />
                <span>Request Community Delivery</span>
              </button>

              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-leaf-400" />
                <span>Browse Farm Shop</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
