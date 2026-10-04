'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Heart,
  Calendar,
  MapPin,
  ExternalLink,
  X,
  Share2,
  Sparkles,
  ShoppingBag,
  Users2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { SocialPost } from '@/types';
import { socialService } from '@/services/socialService';
import { InstagramIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

interface CuratedGalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  category: 'harvest' | 'fields' | 'farmers' | 'dispatch';
  categoryLabel: string;
  location: string;
  date: string;
  likes: number;
}

const CURATED_GALLERY: CuratedGalleryItem[] = [
  {
    id: 'curated-1',
    imageUrl: '/hero/farm-1.jpg',
    caption: 'Sunrise over our partner organic farms in Chevella. Harvesting naturally ripened tomatoes before the morning heat sets in.',
    category: 'harvest',
    categoryLabel: 'Morning Harvest',
    location: 'Chevella Agro-cluster',
    date: 'Dawn Harvest',
    likes: 482,
  },
  {
    id: 'curated-2',
    imageUrl: '/hero/farm-2.jpg',
    caption: 'Our clean, temperature-managed staging and distribution facility. Every crate is gently graded and labeled with farm traceability.',
    category: 'dispatch',
    categoryLabel: 'Packing & Dispatch',
    location: 'Mulugu Central Hub',
    date: 'Morning Dispatch',
    likes: 395,
  },
  {
    id: 'curated-3',
    imageUrl: '/hero/farm-3.jpg',
    caption: 'Tender baby spinach and palak bunches harvested with roots intact, retaining cellular moisture and vital natural aromas.',
    category: 'harvest',
    categoryLabel: 'Morning Harvest',
    location: 'Vikarabad Valley',
    date: 'Daily Pluck',
    likes: 518,
  },
  {
    id: 'curated-4',
    imageUrl: '/hero/farm-4.jpg',
    caption: 'Living soil enrichment using indigenous cow-based Jeevamrutham bio-cultures instead of petroleum-derived synthetic fertilizers.',
    category: 'fields',
    categoryLabel: 'Regenerative Fields',
    location: 'Cheelasagar Acres',
    date: 'Soil Enrichment',
    likes: 426,
  },
  {
    id: 'curated-5',
    imageUrl: '/hero/farm-5.jpg',
    caption: 'Direct covenant partnerships with smallholder farmers across Telangana. Guaranteed fair pricing 30% above mandi spot-rates.',
    category: 'farmers',
    categoryLabel: 'Farmers & Soil',
    location: 'Mahabubnagar Belt',
    date: 'Farmer Community',
    likes: 614,
  },
  {
    id: 'curated-6',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    caption: 'Crisp bell peppers and heirloom cucumbers naturally grown under the warm Deccan sun without cosmetic wax polishing.',
    category: 'fields',
    categoryLabel: 'Regenerative Fields',
    location: 'Chevella Farms',
    date: 'Field Pluck',
    likes: 342,
  },
  {
    id: 'curated-7',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80',
    caption: 'Pre-dawn harvest crates loaded for direct morning transit to gated residential communities across Hyderabad.',
    category: 'dispatch',
    categoryLabel: 'Packing & Dispatch',
    location: 'Hyderabad Express Route',
    date: 'Morning Route',
    likes: 477,
  },
  {
    id: 'curated-8',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fresh vibrant mint, coriander, and native greens bunched in breathable banana-fiber twine, zero single-use plastics.',
    category: 'harvest',
    categoryLabel: 'Morning Harvest',
    location: 'Siddipet Organic Cluster',
    date: 'Dawn Batch',
    likes: 561,
  },
  {
    id: 'curated-9',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    caption: 'Restoring living microbial flora across our partner fields — rich soil creates authentic flavor and elevated nutrition.',
    category: 'farmers',
    categoryLabel: 'Farmers & Soil',
    location: 'Vikarabad Farmlands',
    date: 'Bio-Culture',
    likes: 389,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Moments' },
  { id: 'harvest', label: 'Morning Harvest' },
  { id: 'fields', label: 'Regenerative Fields' },
  { id: 'farmers', label: 'Farmers & Soil' },
  { id: 'dispatch', label: 'Packing & Dispatch' },
];

export function GalleryClient() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [livePosts, setLivePosts] = useState<SocialPost[]>([]);
  const [selectedImage, setSelectedImage] = useState<CuratedGalleryItem | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await socialService.getPosts();
        if (Array.isArray(data) && data.length > 0) {
          setLivePosts(data);
        }
      } catch (err) {
        console.warn('Could not load live social posts:', err);
      }
    }
    fetchPosts();
  }, []);

  // Merge admin-uploaded live posts with curated gallery items
  const allItems: CuratedGalleryItem[] = [
    ...livePosts.map((lp, idx) => ({
      id: lp.id || `live-${idx}`,
      imageUrl: lp.imageUrl,
      caption: lp.caption,
      category: 'harvest' as const,
      categoryLabel: 'Live Farm Story',
      location: 'Telangana Farm Hub',
      date: lp.date || 'Recent',
      likes: lp.likes || 320,
    })),
    ...CURATED_GALLERY,
  ];

  const filteredItems = selectedCategory === 'all'
    ? allItems
    : allItems.filter((item) => item.category === selectedCategory);

  const handleShare = (item: CuratedGalleryItem, e: React.MouseEvent) => {
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

          {/* Quick Pill Highlights */}
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Category Filters */}
        <div className="bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border border-cream-200/90 shadow-md flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 sm:px-5 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-leaf-600 text-white shadow-sm'
                    : 'text-forest-700 hover:text-forest-950 hover:bg-cream-100/70'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
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

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest-950/70 backdrop-blur-md text-white/90 text-[11px] font-medium border border-white/10">
                      <MapPin className="w-3 h-3 text-leaf-400 shrink-0" />
                      <span className="truncate max-w-[130px]">{item.location}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-forest-900 text-[11px] font-semibold border border-white/60">
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Details */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white/90 text-xs">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-cream-100">
                      <Calendar className="w-3 h-3 text-leaf-400" />
                      <span>{item.date}</span>
                    </span>

                    <span className="flex items-center gap-1 text-[11px] font-semibold text-white bg-forest-900/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                      <span>{item.likes}</span>
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
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-leaf-500/15 text-leaf-700 text-xs font-bold border border-leaf-300/40">
                      {selectedImage.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-forest-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-leaf-600" />
                      <span>{selectedImage.location}</span>
                    </span>
                  </div>

                  <p className="font-serif text-base sm:text-lg text-forest-950 font-bold leading-snug">
                    {selectedImage.caption}
                  </p>

                  <div className="flex items-center justify-between text-xs text-forest-600 pt-2 border-t border-cream-200">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-leaf-600" />
                      <span>{selectedImage.date}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-pink-600 font-bold">
                      <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                      <span>{selectedImage.likes} Likes</span>
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
