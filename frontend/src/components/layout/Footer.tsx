'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { buildGeneralWhatsAppUrl } from '@/utils/whatsapp';
import {
  Sprout,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Heart,
  ShieldCheck,
  Truck,
  Leaf,
} from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';

export function Footer() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const whatsappUrl = buildGeneralWhatsAppUrl({
    phone: settings.whatsappNumber,
    companyName: settings.companyName,
  });

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative bg-forest-950 text-cream-100 overflow-hidden pt-16 pb-10 border-t border-forest-800">
      {/* Background organic leaf aura */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-leaf-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-leaf-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Trust Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-12 border-b border-forest-800/80 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-500/20 text-leaf-300">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-white">100% Zero-Chemical</h5>
              <p className="text-xs text-cream-200/70">Naturally cultivated with bio-compost</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-500/20 text-leaf-300">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-white">Morning Farm Run</h5>
              <p className="text-xs text-cream-200/70">Delivered within 8 hours of harvest</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-500/20 text-leaf-300">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-white">Direct WhatsApp Order</h5>
              <p className="text-xs text-cream-200/70">No complex checkouts or hidden fees</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-500/20 text-leaf-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h5 className="font-semibold text-white">Guaranteed Freshness</h5>
              <p className="text-xs text-cream-200/70">Direct replacement if not delighted</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-forest-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-md ring-1 ring-white/20">
                <Image
                  src={settings.logoUrl || '/logo.png'}
                  alt={`${settings.companyName} Logo`}
                  width={52}
                  height={52}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex w-full justify-between font-sans text-xl sm:text-2xl font-black tracking-normal leading-none uppercase text-white">
                  {(settings.companyName.split(' ')[0] || 'VIKRSHI')
                    .toUpperCase()
                    .split('')
                    .map((char, idx) => (
                      <span key={idx}>{char}</span>
                    ))}
                </div>
                <span className="text-[9.5px] uppercase font-bold tracking-[0.16em] leading-tight text-leaf-300 mt-1 whitespace-nowrap">
                  {settings.companyName.split(' ').slice(1).join(' ') || 'Suppliers Pvt Ltd'}
                </span>
              </div>
            </Link>

            <p className="text-sm text-cream-200/80 leading-relaxed max-w-sm">
              {settings.footerDescription || settings.shortDescription}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect on WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-200"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400 hover:bg-pink-600 hover:text-white transition-all duration-200"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* 3 Columns in a single line on mobile (Explore, Company, Farm Hub) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-6 lg:contents">
            {/* Quick Links */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-serif text-sm sm:text-base lg:text-lg font-semibold text-white">Explore</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs md:text-sm text-cream-200/80">
                <li>
                  <Link href="/" className="hover:text-leaf-300 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-leaf-300 transition-colors">
                    Shop All Produce
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=vegetables" className="hover:text-leaf-300 transition-colors">
                    Fresh Vegetables
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=fruits" className="hover:text-leaf-300 transition-colors">
                    Fresh Fruits
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=greens" className="hover:text-leaf-300 transition-colors">
                    Leafy Greens
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=seasonal" className="hover:text-leaf-300 transition-colors">
                    Seasonal Produce
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company & Knowledge */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-serif text-sm sm:text-base lg:text-lg font-semibold text-white">Company</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs md:text-sm text-cream-200/80">
                <li>
                  <Link href="/about" className="hover:text-leaf-300 transition-colors">
                    Our Story & Mission
                  </Link>
                </li>
                <li>
                  <Link href="/reviews" className="hover:text-leaf-300 transition-colors">
                    Customer Reviews
                  </Link>
                </li>
                <li>
                  <Link href="/locations" className="hover:text-leaf-300 transition-colors">
                    Service Locations
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-leaf-300 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-leaf-300 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-leaf-300 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Hub */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-serif text-sm sm:text-base lg:text-lg font-semibold text-white">Farm Hub</h4>
              <div className="space-y-2 sm:space-y-2.5 text-[10px] sm:text-xs text-cream-200/80">
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <MapPin className="h-3.5 w-3.5 text-leaf-300 shrink-0 mt-0.5" />
                  <span className="leading-tight">
                    {settings.address.fullText || settings.address.line1}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Phone className="h-3.5 w-3.5 text-leaf-300 shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-white truncate">
                    {settings.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Mail className="h-3.5 w-3.5 text-leaf-300 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-white truncate">
                    {settings.email}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Clock className="h-3.5 w-3.5 text-leaf-300 shrink-0" />
                  <span className="leading-tight">{settings.businessHours.fullText || settings.businessHours.weekdays}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-200/60">
          <p className="text-center md:text-left">
            © {currentYear} {settings.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-center">
            <span className="text-leaf-400 font-medium">
              Fresh Produce • Trusted Quality • From Farm to Home
            </span>
          </div>
          <p className="flex items-center gap-1 text-center md:text-right">
            Grown with <Heart className="h-3 w-3 text-red-400 fill-red-400" /> for healthy families
          </p>
        </div>
      </div>
    </footer>
  );
}
