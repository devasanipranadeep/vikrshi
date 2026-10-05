'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import { instagramPosts } from '@/constants/mockData';
import { galleryService } from '@/services/gallery';
import { SocialPost } from '@/types';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';
import { Heart, ExternalLink, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';
import { motion } from 'framer-motion';

export function FarmJourneyInstagram() {
  const { settings } = useSettings();
  const [posts, setPosts] = useState<SocialPost[]>([]);

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

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-20 bg-cream-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
              Gallery
            </h2>
          </div>

          <a
            href={settings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-700 px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors self-start md:self-auto border border-pink-200"
          >
            <InstagramIcon className="h-4 w-4" />
            <span>{settings.instagramHandle || '@vikrshi'}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Grid of Dynamic Instagram preview cards - 2 per line on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {posts.map((post, index) => {
            const destinationUrl = post.postUrl || settings.instagramUrl;
            return (
              <motion.a
                key={post.id}
                href={destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-cream-200 shadow-2xs hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-cream-100">
                  <Image
                    src={post.imageUrl}
                    alt={post.caption || 'Vikrshi farm post'}
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
                    <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
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
                  <span className="text-forest-700/70">{post.date}</span>
                  <span className="text-pink-600 font-semibold group-hover:underline flex items-center gap-0.5">
                    <span>Instagram</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
