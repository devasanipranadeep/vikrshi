'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GalleryItem } from '@/types';
import { galleryService } from '@/services/galleryService';
import { initialGalleryItems } from '@/constants/mockData';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';
import {
  Images,
  MapPin,
  ArrowRight,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function GalleryTeaserSection() {
  const [items, setItems] = useState<GalleryItem[]>(() =>
    initialGalleryItems.slice(0, 4)
  );

  const fetchFeaturedItems = useCallback(async () => {
    try {
      const data = await galleryService.getGalleryItems('all', false);
      if (data && data.length > 0) {
        // Take featured items or first 4
        const featured = data.filter((i) => i.featured);
        setItems(featured.length >= 2 ? featured.slice(0, 4) : data.slice(0, 4));
      }
    } catch {
      // Keep initial fallback
    }
  }, []);

  useEffect(() => {
    fetchFeaturedItems();
    const unsubscribe = subscribeToStoreUpdates(() => {
      fetchFeaturedItems();
    }, ['gallery', 'all']);
    return () => unsubscribe();
  }, [fetchFeaturedItems]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-cream-100/60 relative overflow-hidden border-t border-cream-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-700 bg-leaf-100 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-3 border border-leaf-200">
              <Sparkles className="w-3.5 h-3.5 text-leaf-600" />
              <span>Visual Farm Transparency</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
              Grown With Care, Captured In The Fields
            </h2>
            <p className="mt-2 text-sm text-forest-700/80 max-w-xl">
              Authentic photography from our Telangana agro-clusters, dawn harvest routines, and hygienic cold-chain sorting.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 self-start md:self-auto bg-forest-950 hover:bg-forest-900 text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all hover:gap-3 shadow-sm hover:shadow-md"
          >
            <Images className="w-4 h-4 text-leaf-400" />
            <span>Explore Full Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Photo Grid (2x2 on mobile, 4 columns on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-forest-950 aspect-4/3 sm:aspect-3/4 border border-cream-200/80 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <Link href="/gallery" className="block w-full h-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Category Pill */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-white/95 text-forest-950 px-2 py-0.5 rounded-full shadow-xs">
                    {item.category === 'community' ? 'Community Delivery' : 'Farms'}
                  </span>
                </div>

                {/* Expand / View Icon */}
                <div className="absolute top-2.5 right-2.5 z-10 h-7 w-7 rounded-full bg-forest-950/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 text-white">
                  <div className="flex items-center gap-1 text-[10px] text-leaf-300 font-medium mb-1 truncate">
                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{item.locationTag || 'Telangana'}</span>
                  </div>
                  <h3 className="font-serif text-xs sm:text-sm font-bold text-white group-hover:text-leaf-300 transition-colors line-clamp-1 leading-snug">
                    {item.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
