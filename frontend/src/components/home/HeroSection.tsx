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
    src: '/hero/farm-1.jpg?v=2',
    alt: 'Organic farming fields and fresh produce cultivation',
  },
  {
    src: '/hero/farm-2.jpg',
    alt: 'Fresh green vegetables and crops growing in rich organic soil',
  },
  {
    src: '/hero/farm-3.jpg',
    alt: 'Lush agricultural farmland and healthy harvest',
  },
  {
    src: '/hero/farm-4.jpg',
    alt: 'Morning harvest from organic partner farms',
  },
  {
    src: '/hero/farm-5.jpg',
    alt: 'Vibrant farmland and natural agro cultivation',
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
    <section className="relative min-h-[100vh] min-h-[100dvh] md:min-h-[calc(100vh+0.5cm)] flex flex-col overflow-hidden bg-forest-950 text-white -mb-2 border-none outline-none">
      {/* Sliding Background Images — extended below section (-bottom-16) so hero farm images are fully visible down to the phone edge */}
      <div className="absolute inset-0 -bottom-16 z-0">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}
        {/* Gradient overlay - subtle top and bottom shading for navbar & CTA readability while keeping farm images vibrant */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/20 to-forest-950/80 z-[2] pointer-events-none" />
        {/* Dark bottom gradient to eliminate any white line */}
        <div className="absolute -bottom-4 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-forest-950 z-[3] pointer-events-none" />
      </div>

      {/* Main Content Container - CTA buttons positioned near bottom so farm images are fully visible */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-end w-full flex-1 pb-24 sm:pb-20">
        <h1 className="sr-only">Vikrshi Suppliers - Fresh Farm Produce</h1>

        {/* CTAs */}
        <div className="flex flex-col items-center w-full px-4 sm:px-0">
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-xs sm:max-w-none"
          >
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-leaf-500 hover:bg-leaf-600 text-white font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base shadow-xl shadow-forest-950/60 transition-all hover:gap-3 cursor-pointer"
            >
              <span>Shop Fresh Products</span>
              <ArrowRight className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base shadow-xl shadow-forest-950/60 transition-all cursor-pointer"
            >
              <MessageCircle className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              <span>Order on WhatsApp</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
