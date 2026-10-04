'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GalleryItem, GalleryCategory } from '@/types';
import { galleryService } from '@/services/galleryService';
import { initialGalleryItems } from '@/constants/mockData';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';
import { useSettings } from '@/context/SettingsContext';
import { buildGeneralWhatsAppUrl } from '@/utils/whatsapp';
import {
  Images,
  MapPin,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Sprout,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GalleryClient() {
  const { settings } = useSettings();
  const [items, setItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const data = await galleryService.getGalleryItems('all', false);
      if (data && data.length > 0) {
        setItems(data);
      }
    } catch {
      // Keep initial fallback items
    }
  }, []);

  useEffect(() => {
    fetchItems();
    const unsubscribe = subscribeToStoreUpdates(() => {
      fetchItems();
    }, ['gallery', 'all']);
    return () => unsubscribe();
  }, [fetchItems]);

  const categories: { id: GalleryCategory; label: string; count?: number }[] = [
    { id: 'all', label: 'All Photos' },
    { id: 'farms', label: 'Living Soil & Farms' },
    { id: 'harvest', label: 'Morning Harvest' },
    { id: 'coldchain', label: 'Cold Chain & Sorting' },
    { id: 'community', label: 'Community Deliveries' },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  // Handle lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const activeLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const whatsappUrl = buildGeneralWhatsAppUrl({
    phone: settings.whatsappNumber,
    companyName: settings.companyName,
  });

  return (
    <div className="min-h-screen bg-cream-50 text-forest-950 pt-24 sm:pt-28 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-forest-950 text-cream-50 py-16 sm:py-24 mb-12">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-leaf-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-leaf-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-leaf-500/20 text-leaf-300 border border-leaf-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Farm & Facility Photography</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Our Living Farms, Cold Chain & Daily Harvest
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-cream-200/80 max-w-2xl mx-auto leading-relaxed"
          >
            A transparent photographic chronicle of chemical-free cultivation across Telangana, 5:00 AM harvests, hygienic sorting, and same-day Hyderabad deliveries.
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto text-left"
          >
            <div className="bg-white/5 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-white/10">
              <span className="text-leaf-400 font-serif text-xl sm:text-2xl font-bold block">100% Zero-Gas</span>
              <span className="text-[11px] sm:text-xs text-cream-200/70">Naturally sun-ripened crops</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-white/10">
              <span className="text-leaf-400 font-serif text-xl sm:text-2xl font-bold block">5:00 AM</span>
              <span className="text-[11px] sm:text-xs text-cream-200/70">Morning harvest plucking</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-white/10">
              <span className="text-leaf-400 font-serif text-xl sm:text-2xl font-bold block">&lt; 12 Hours</span>
              <span className="text-[11px] sm:text-xs text-cream-200/70">Harvest-to-kitchen window</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-white/10">
              <span className="text-leaf-400 font-serif text-xl sm:text-2xl font-bold block">Chevella</span>
              <span className="text-[11px] sm:text-xs text-cream-200/70">& Vikarabad agro-clusters</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => {
            const count =
              cat.id === 'all'
                ? items.length
                : items.filter((i) => i.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-forest-950 text-white shadow-md shadow-forest-950/20'
                    : 'bg-white text-forest-800 hover:bg-cream-200/60 border border-cream-200/80'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-leaf-500 text-forest-950 font-bold' : 'bg-cream-100 text-forest-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid (2 columns on mobile, 3 on tablet, 3 on desktop) */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-cream-200/80 my-8">
            <Images className="w-12 h-12 text-forest-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-forest-950">No photos in this category yet</h3>
            <p className="text-xs text-forest-600 mt-1">Please check back soon or browse All Photos.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 px-4 py-2 bg-leaf-600 text-white rounded-xl text-xs font-semibold hover:bg-leaf-700 transition-colors"
            >
              View All Photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                onClick={() => setLightboxIndex(index)}
                className="group relative cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-forest-950 aspect-4/3 sm:aspect-16/11 border border-cream-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Dark Gradient Overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/30 to-transparent opacity-80 sm:opacity-70 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10">
                  <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-forest-950 px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs">
                    {item.category}
                  </span>
                </div>

                {/* Expand Icon */}
                <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-forest-950/70 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 z-10 text-white">
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs text-leaf-300 font-medium mb-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.locationTag || 'Telangana'}</span>
                  </div>
                  <h3 className="font-serif text-xs sm:text-base md:text-lg font-bold text-white group-hover:text-leaf-300 transition-colors line-clamp-1 leading-snug">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="hidden sm:block text-xs text-cream-200/80 mt-1 line-clamp-1">
                      {item.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom Call to Action */}
        <div className="mt-16 bg-forest-950 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-leaf-500/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-400 bg-leaf-900/60 px-3.5 py-1 rounded-full inline-block">
              Taste The Difference
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight">
              Ready to Experience Authentic Farm-Fresh Products?
            </h2>
            <p className="text-sm sm:text-base text-cream-200/80 leading-relaxed">
              Order directly from today’s sunrise harvest via WhatsApp. No middlemen, no chemical preservatives, straight to your doorstep.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-105 shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order on WhatsApp</span>
              </a>
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/20 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Online Store</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxItem && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-forest-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 p-2 sm:p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Content Box */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full bg-forest-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Image Container */}
              <div className="relative w-full h-[55vh] sm:h-[65vh] bg-black">
                <Image
                  src={activeLightboxItem.imageUrl}
                  alt={activeLightboxItem.title}
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              {/* Information Footer */}
              <div className="p-4 sm:p-6 bg-forest-900/90 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap text-xs text-leaf-300">
                    <span className="font-bold uppercase tracking-wider bg-leaf-500/20 px-2 py-0.5 rounded-full border border-leaf-400/30">
                      {activeLightboxItem.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{activeLightboxItem.locationTag || 'Telangana'}</span>
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="flex items-center gap-1 text-white/70">
                      <Calendar className="w-3 h-3" />
                      <span>{activeLightboxItem.date || 'Recent'}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                    {activeLightboxItem.title}
                  </h3>

                  {activeLightboxItem.caption && (
                    <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed">
                      {activeLightboxItem.caption}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-white/50 hidden sm:block">
                    {lightboxIndex + 1} of {filteredItems.length}
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 rounded-full text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
