'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useSettings } from '@/context/SettingsContext';
import { buildGeneralWhatsAppUrl } from '@/utils/whatsapp';
import {
  MapPin,
  ShoppingBag,
  Search,
  Menu,
  X,
  Sprout,
  MessageCircle,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const { selectedLocation, openLocationSelector } = useLocation();
  const { settings } = useSettings();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Detect scroll to toggle transparent vs solid glassmorphism navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'About Us', href: '/about' },
    { name: 'Locations', href: '/locations' },
    { name: 'Contact', href: '/contact' },
  ];

  const whatsappUrl = buildGeneralWhatsAppUrl({
    phone: settings.whatsappNumber,
    companyName: settings.companyName,
    location: selectedLocation,
  });

  const isHome = pathname === '/';
  // If at top of home page, navbar can have transparent backdrop with crisp contrast
  const isTransparent = isHome && !isScrolled;

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent py-4 text-white'
            : 'glass-nav py-3 text-forest-900 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-leaf-400 rounded-lg p-1"
            >
              <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm group-hover:scale-105 transition-transform ring-1 ring-forest-900/10">
                <Image
                  src={settings.logoUrl || '/logo.png'}
                  alt={`${settings.companyName} Logo`}
                  width={56}
                  height={56}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div
                  className={`flex w-full justify-between font-sans text-xl sm:text-2xl font-black tracking-normal leading-none uppercase ${
                    isTransparent ? 'text-white' : 'text-forest-900'
                  }`}
                >
                  {(settings.companyName.split(' ')[0] || 'VIKRSHI')
                    .toUpperCase()
                    .split('')
                    .map((char, idx) => (
                      <span key={idx}>{char}</span>
                    ))}
                </div>
                <span
                  className={`text-[9.5px] uppercase font-bold tracking-[0.16em] leading-tight mt-1 whitespace-nowrap ${
                    isTransparent ? 'text-white/80' : 'text-leaf-600'
                  }`}
                >
                  {settings.companyName.split(' ').slice(1).join(' ') || 'Suppliers Pvt Ltd'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href) && !link.href.includes('?'));

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? isTransparent
                          ? 'bg-white/20 text-white font-semibold'
                          : 'bg-leaf-50 text-leaf-600 font-semibold'
                        : isTransparent
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : 'text-forest-800 hover:text-leaf-600 hover:bg-cream-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Location Selector Pill */}
              <button
                onClick={openLocationSelector}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  isTransparent
                    ? 'bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-md'
                    : 'bg-leaf-50 text-leaf-600 border border-leaf-100 hover:bg-leaf-100'
                }`}
                title="Select Delivery Location"
              >
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-semibold">{selectedLocation}</span>
                <span className="sm:hidden font-semibold">{selectedLocation.slice(0, 3)}</span>
                <ChevronDown className="h-3 w-3 opacity-70" />
              </button>

              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`rounded-full p-2 transition-colors ${
                  isTransparent
                    ? 'text-white/90 hover:bg-white/15 hover:text-white'
                    : 'text-forest-800 hover:bg-cream-100 hover:text-leaf-600'
                }`}
                aria-label="Search produce"
              >
                <Search className="h-4.5 w-4.5" />
              </button>

              {/* Direct WhatsApp CTA Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-xs transition-all ${
                  isTransparent
                    ? 'bg-[#25D366] text-white hover:bg-[#20ba5a]'
                    : 'bg-[#25D366] text-white hover:bg-[#20ba5a]'
                }`}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>

              {/* Order List / Cart Trigger */}
              <button
                onClick={openCart}
                className={`relative rounded-full p-2 transition-colors ${
                  isTransparent
                    ? 'text-white hover:bg-white/15'
                    : 'text-forest-900 hover:bg-cream-100'
                }`}
                aria-label="View Order List"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-harvest-amber text-[10px] font-bold text-forest-950 shadow-sm animate-scale">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden rounded-full p-2 transition-colors ${
                  isTransparent
                    ? 'text-white hover:bg-white/15'
                    : 'text-forest-900 hover:bg-cream-100'
                }`}
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-forest-950/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              className="relative z-10 w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl border border-leaf-100"
            >
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3.5 h-5 w-5 text-forest-700/60" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search fresh vegetables, fruits, leafy greens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-cream-50 border border-cream-300 py-3 pl-11 pr-12 text-sm text-forest-900 placeholder:text-forest-700/50 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 p-1 text-forest-700/60 hover:text-forest-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-3 flex items-center gap-2 text-xs text-forest-700/70 flex-wrap">
                <span>Popular:</span>
                {['Naatu Tomatoes', 'Baby Palak', 'Ooty Carrots', 'Ruby Pomegranate', 'Wild Sitaphal'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        router.push(`/shop?search=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className="rounded-lg bg-cream-100 px-2 py-1 text-forest-800 hover:bg-leaf-50 hover:text-leaf-600 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-forest-950/70 backdrop-blur-sm"
            />

            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-xs bg-cream-50 shadow-2xl flex flex-col p-6 border-l border-leaf-100"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-cream-200">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1 shadow-sm ring-1 ring-forest-900/10">
                      <Image
                        src={settings.logoUrl || '/logo.png'}
                        alt={`${settings.companyName} Logo`}
                        width={44}
                        height={44}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex w-full justify-between font-sans text-lg font-black tracking-normal leading-none uppercase text-forest-900">
                        {(settings.companyName.split(' ')[0] || 'VIKRSHI')
                          .toUpperCase()
                          .split('')
                          .map((char, idx) => (
                            <span key={idx}>{char}</span>
                          ))}
                      </div>
                      <span className="text-[8.5px] uppercase font-bold tracking-[0.16em] leading-tight text-leaf-600 mt-1 whitespace-nowrap">
                        {settings.companyName.split(' ').slice(1).join(' ') || 'Suppliers Pvt Ltd'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full p-2 text-forest-900/60 hover:bg-cream-200"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Location indicator in mobile menu */}
                <div className="mt-4 rounded-xl bg-white p-3 border border-cream-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-forest-900">
                      <MapPin className="h-3.5 w-3.5 text-leaf-500" />
                      <span>Delivery Hub: <strong className="text-leaf-600">{selectedLocation}</strong></span>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openLocationSelector();
                      }}
                      className="text-leaf-500 font-semibold underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Nav Links */}
                <div className="mt-6 flex-1 overflow-y-auto space-y-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-leaf-500 text-white font-semibold'
                            : 'text-forest-900 hover:bg-cream-200'
                        }`}
                      >
                        <span>{link.name}</span>
                        <ArrowRight className="h-4 w-4 opacity-70" />
                      </Link>
                    );
                  })}
                </div>

                {/* WhatsApp Action */}
                <div className="pt-4 border-t border-cream-200 space-y-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white py-3 text-sm font-semibold shadow-sm hover:bg-[#20ba5a]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                  <p className="text-center text-[11px] text-forest-700/60">
                    {settings.companyName} • {settings.whatsappDisplay}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
