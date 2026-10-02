'use client';

import React from 'react';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import { instagramPosts } from '@/constants/mockData';
import { Heart, ExternalLink, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';
import { motion } from 'framer-motion';

export function FarmJourneyInstagram() {
  const { settings } = useSettings();

  return (
    <section className="py-20 bg-cream-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-600 bg-leaf-100/60 px-3 py-1 rounded-full inline-block mb-3">
              Social Community
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
              Follow Our Farm Journey
            </h2>
            <p className="mt-2 text-sm text-forest-700/80 max-w-xl">
              Daily morning stories, harvest reels, soil science updates, and farm life moments from Chevella and Vikarabad.
            </p>
          </div>

          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-700 px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors self-start md:self-auto border border-pink-200"
          >
            <InstagramIcon className="h-4 w-4" />
            <span>{settings.instagramHandle}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Grid of Instagram preview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-cream-200 shadow-2xs hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-cream-100">
                <Image
                  src={post.imageUrl}
                  alt={post.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                  <span className="flex items-center gap-1 text-sm font-bold">
                    <Heart className="h-5 w-5 fill-white" />
                    {post.likes}
                  </span>
                  <ExternalLink className="h-5 w-5" />
                </div>
              </div>

              {/* Caption */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <p className="text-xs text-forest-800 line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-forest-700/60 pt-2 border-t border-cream-100">
                  <span>{post.date}</span>
                  <span className="text-pink-600 font-semibold group-hover:underline">View on Instagram</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
