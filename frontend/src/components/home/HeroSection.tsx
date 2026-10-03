'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import { useLocation } from '@/context/LocationContext';
import { buildGeneralWhatsAppUrl } from '@/utils/whatsapp';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=85',
    alt: 'Sunlit organic farm fields at golden hour',
  },
  {
    src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=2000&q=85',
    alt: 'Fresh green vegetables growing in rich soil',
  },
  {
    src: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000&q=85',
    alt: 'Lush rice paddy fields stretching to the horizon',
  },
  {
    src: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=2000&q=85',
    alt: 'Farmer harvesting fresh produce at dawn',
  },
  {
    src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2000&q=85',
    alt: 'Fresh organic farm vegetables and harvest',
  },
];

const SLIDE_INTERVAL = 3000; // 3 seconds per slide

export function HeroSection() {
  const { settings } = useSettings();
  const { selectedLocation } = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const whatsappUrl = buildGeneralWhatsAppUrl({
    phone: settings.whatsappNumber,
    companyName: settings.companyName,
    location: selectedLocation,
    customGreeting: `Hello Vikrshi Suppliers, I would like to order fresh farm harvest in ${selectedLocation}. Please send today's available produce catalog.`,
  });

  return (
    <section className="relative min-h-screen min-h-[100dvh] flex flex-col overflow-hidden bg-forest-950 text-white">
      {/* Sliding Background Images — all preloaded, crossfade via opacity */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: index === currentIndex ? 1 : 0 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/55 to-forest-950/85 z-10" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-between w-full flex-1 pt-32 sm:pt-40 pb-12 sm:pb-16">
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
        <div className="flex flex-col items-center">

          {/* CTA Buttons */}
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
      </div>
    </section>
  );
}
