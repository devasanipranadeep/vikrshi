'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import { useLocation } from '@/context/LocationContext';
import { buildGeneralWhatsAppUrl } from '@/utils/whatsapp';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const { settings } = useSettings();
  const { selectedLocation } = useLocation();

  const whatsappUrl = buildGeneralWhatsAppUrl({
    phone: settings.whatsappNumber,
    companyName: settings.companyName,
    location: selectedLocation,
    customGreeting: `Hello Vikrshi Suppliers, I would like to order fresh farm harvest in ${selectedLocation}. Please send today's available produce catalog.`,
  });

  return (
    <section className="relative min-h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden bg-forest-950 text-white pt-20 pb-16">
      {/* Background Hero Image with Balanced Depth */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=85"
          alt="Sunlit organic farm in Hyderabad"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-80 contrast-105"
        />
        {/* Balanced gradient overlay for optimal depth and rich typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/55 to-forest-950/85" />
      </div>

      {/* Main Content Container - Ultra Clean, Spacious & High-Impact */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-between w-full h-full min-h-screen min-h-[100dvh] pt-32 sm:pt-40 pb-16 sm:pb-20">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15] drop-shadow-md"
        >
          Fresh From Our Farms,{' '}
          <span className="text-leaf-300 italic font-serif block sm:inline mt-2 sm:mt-0 drop-shadow-md">
            Naturally Yours.
          </span>
        </motion.h1>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-leaf-500 hover:bg-leaf-600 text-white font-semibold px-8 py-4 text-base shadow-xl shadow-forest-950/60 transition-all hover:gap-3 cursor-pointer"
          >
            <span>Shop Fresh Products</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold px-8 py-4 text-base shadow-xl shadow-forest-950/60 transition-all cursor-pointer"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Order on WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
