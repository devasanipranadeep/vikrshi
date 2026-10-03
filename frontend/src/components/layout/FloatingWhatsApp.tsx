'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { useLocation } from '@/context/LocationContext';
import { buildGeneralWhatsAppUrl } from '@/utils/whatsapp';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const { selectedLocation } = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // On homepage, only show floating button after scrolling past hero section to prevent button collision
  useEffect(() => {
    if (pathname === '/') {
      const handleScroll = () => {
        setIsVisible(window.scrollY > 350);
      };
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setIsVisible(true);
    }
  }, [pathname]);

  if (pathname?.startsWith('/admin') || !isVisible) {
    return null;
  }

  const whatsappUrl = buildGeneralWhatsAppUrl({
    phone: settings.whatsappNumber,
    companyName: settings.companyName,
    location: selectedLocation,
  });

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-auto">
      {/* Tooltip bubble - desktop only, never covers mobile buttons */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="hidden sm:block mb-3 max-w-[220px] rounded-2xl bg-white p-3 shadow-xl border border-leaf-100 text-xs text-forest-900 relative"
          >
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-forest-800 text-white hover:bg-forest-900"
              aria-label="Close tooltip"
            >
              <X className="h-3 w-3" />
            </button>
            <p className="font-semibold text-leaf-600 flex items-center gap-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Order Farm-Fresh
            </p>
            <p className="mt-1 text-forest-700/80 leading-tight">
              Chat directly with our farm team in {selectedLocation}!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/50"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 blur-md animate-pulse -z-10" />
        <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
        <span className="sr-only">Chat on WhatsApp</span>
      </motion.a>
    </div>
  );
}
