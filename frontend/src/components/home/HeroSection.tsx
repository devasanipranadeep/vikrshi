'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import { useLocation } from '@/context/LocationContext';
import { buildGeneralWhatsAppUrl } from '@/utils/whatsapp';
import {
  ArrowRight,
  MessageCircle,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const { settings } = useSettings();
  const { selectedLocation, openLocationSelector } = useLocation();

  const whatsappUrl = buildGeneralWhatsAppUrl({
    phone: settings.whatsappNumber,
    companyName: settings.companyName,
    location: selectedLocation,
    customGreeting: `Hello Vikrshi Suppliers, I would like to order fresh farm harvest in ${selectedLocation}. Please send today's available produce catalog.`,
  });

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-forest-950 text-white pt-32 pb-20">
      {/* Background Hero Image with Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=85"
          alt="Sunlit organic farm in Hyderabad"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter brightness-75 contrast-105"
        />
        {/* Layered gradients for legibility and atmospheric depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/90 via-forest-950/75 to-forest-950/95" />
      </div>

      {/* Main Content Container - Centered, Spacious & Completely Free of Floating Elements */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Location Delivery Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full bg-leaf-500/20 px-4 py-1.5 backdrop-blur-md border border-leaf-400/30 text-xs sm:text-sm font-medium text-leaf-200 mb-6"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Delivering fresh daily to:</span>
          <button
            onClick={openLocationSelector}
            className="font-bold text-white hover:text-leaf-300 underline flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            {selectedLocation}, Telangana
          </button>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.12] mb-8 sm:mb-10"
        >
          Fresh From Our Farms,{' '}
          <span className="text-leaf-300 italic font-serif">Naturally Yours.</span>
        </motion.h1>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-leaf-500 hover:bg-leaf-600 text-white font-semibold px-8 py-4 text-base shadow-xl shadow-leaf-950/50 transition-all hover:gap-3 cursor-pointer"
          >
            <span>Shop Fresh Products</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold px-8 py-4 text-base shadow-xl shadow-emerald-950/50 transition-all cursor-pointer"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Order on WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
