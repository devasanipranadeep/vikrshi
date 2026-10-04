'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/context/SettingsContext';
import { buildCommunityRequestWhatsAppUrl } from '@/utils/whatsapp';
import { submitCommunityRequestAction } from '@/actions/community';
import { notifyStoreUpdate } from '@/utils/storeEvents';
import {
  X,
  MessageCircle,
  Building2,
  MapPin,
  Phone,
  User,
  Sparkles,
  ChevronDown,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Compass,
  Check,
  Sprout,
  Truck,
} from 'lucide-react';
import { toast } from 'sonner';

const HEAR_ABOUT_OPTIONS = [
  'Resident / Apartment WhatsApp Group',
  'Friend or Family Recommendation',
  'Instagram (@vikrshi)',
  'Google Search',
  'Facebook / Social Media',
  'Community Event / Farmers Market',
  'Other',
];

const POPUP_DELAY_MS = 7000;

export function CommunityRequestModal() {
  const { settings } = useSettings();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isDismissedRef = useRef(false);
  const hasTriggeredRef = useRef(false);

  // Form states
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [address, setAddress] = useState('');
  const [source, setSource] = useState('');
  const [details, setDetails] = useState('');

  // Global 7-second countdown from opening the website (persists across page transitions)
  useEffect(() => {
    const timer = setTimeout(() => {
      hasTriggeredRef.current = true;
      if (!isDismissedRef.current && !window.location.pathname.startsWith('/admin')) {
        setIsOpen(true);
      }
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  // If 7 seconds passed while on admin and user moves to public page, show popup
  useEffect(() => {
    if (
      hasTriggeredRef.current &&
      !isDismissedRef.current &&
      !isOpen &&
      !isSubmitted &&
      !pathname?.startsWith('/admin')
    ) {
      setIsOpen(true);
    }
  }, [pathname, isOpen, isSubmitted]);

  // Support manual open via custom events from anywhere in the app
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-community-modal', handleOpen);
    window.addEventListener('open_community_popup', handleOpen);
    return () => {
      window.removeEventListener('open-community-modal', handleOpen);
      window.removeEventListener('open_community_popup', handleOpen);
    };
  }, []);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    isDismissedRef.current = true;
    setIsOpen(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        isDismissedRef.current = true;
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicantName.trim() || !phone.trim() || !communityName.trim() || !address.trim() || !source) {
      toast.error('Please fill in all required fields, including Phone / WhatsApp.');
      return;
    }

    const waPhone = settings?.whatsappNumber || '919441469814';
    const waUrl = buildCommunityRequestWhatsAppUrl({
      phone: waPhone,
      companyName: settings?.companyName || 'Vikrshi Suppliers Pvt Ltd',
      request: {
        applicantName: applicantName.trim(),
        phone: phone.trim() || undefined,
        communityName: communityName.trim(),
        address: address.trim(),
        source,
        details: details.trim() || undefined,
      },
    });

    setIsSubmitted(true);
    toast.success('Redirecting to WhatsApp with your community request...');

    // Persist to Supabase database in the background
    submitCommunityRequestAction({
      applicantName: applicantName.trim(),
      phone: phone.trim() || undefined,
      communityName: communityName.trim(),
      address: address.trim(),
      source,
      details: details.trim() || undefined,
    }).then((res) => {
      if (res?.success) {
        notifyStoreUpdate('all');
      }
    }).catch((err) => {
      console.warn('Could not save community request to database:', err);
    });

    // Open WhatsApp in new tab
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    // Smoothly exit after success acknowledgement
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-forest-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(10,35,20,0.45)] border border-cream-200/90 overflow-hidden my-auto animate-in zoom-in-95 duration-300 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button (Top Right of Card) */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 z-50 p-2.5 rounded-full bg-cream-100 hover:bg-cream-200 text-forest-800 hover:text-forest-950 shadow-sm transition-all duration-200 cursor-pointer group"
          aria-label="Close community popup"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* LEFT COLUMN: Visual Brand & Community Benefits Panel */}
        <div className="relative md:w-5/12 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -right-8 -top-8 w-44 h-44 bg-leaf-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Header Information */}
          <div className="relative z-10 space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leaf-500/20 text-leaf-300 border border-leaf-400/30 text-[11px] font-semibold tracking-wide backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Gated Societies & Communities</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Bring Fresh Organic Harvests{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-300 via-emerald-200 to-leaf-400">
                to Your Community
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-cream-100/80 leading-relaxed">
              Resident or RWA lead? Request a dedicated direct-from-farm weekly harvest delivery or organic pop-up for your society.
            </p>
          </div>

          {/* Value Bullet Points */}
          <div className="relative z-10 my-6 space-y-2.5 text-xs text-cream-100/90">
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-leaf-500/20 text-leaf-400 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Harvested morning of delivery from Vedic organic farms</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-leaf-500/20 text-leaf-400 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Scheduled weekly drop-off slot directly to your apartment gate</span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-full bg-leaf-500/20 text-leaf-400 shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Chemical-free vegetables, seasonal fruits & cold-pressed oils</span>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-forest-800/80 flex items-center justify-between text-[11px] text-cream-200/70">
            <span className="flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-leaf-400" />
              <span>Certified Organic Practices</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Same-Day Farm Dispatch</span>
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Form Panel */}
        <div className="md:w-7/12 p-6 sm:p-8 bg-white flex flex-col justify-between">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-3.5 my-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-forest-950">
                Opening WhatsApp Dispatch
              </h3>
              <p className="text-xs text-forest-600 max-w-sm mx-auto leading-relaxed">
                Your community request details have been composed. Simply hit <strong className="text-forest-900 font-semibold">Send</strong> in WhatsApp to connect directly with our farm dispatch team!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-left my-auto">
              <div className="pr-8 mb-2">
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  Community Partner Request
                </h3>
                <p className="text-xs text-forest-600">
                  Fill in your society details below to receive availability and dispatch options.
                </p>
              </div>

              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Your Name <span className="text-leaf-600">*</span>
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 group-focus-within:text-leaf-600 transition-colors" />
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 text-xs text-forest-900 placeholder:text-forest-400 focus:bg-white focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10 transition-all duration-200 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Phone / WhatsApp <span className="text-leaf-600">*</span>
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 group-focus-within:text-leaf-600 transition-colors" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 text-xs text-forest-900 placeholder:text-forest-400 focus:bg-white focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10 transition-all duration-200 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Community Name & Heard About Us */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Community / Society Name <span className="text-leaf-600">*</span>
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 group-focus-within:text-leaf-600 transition-colors" />
                    <input
                      type="text"
                      required
                      value={communityName}
                      onChange={(e) => setCommunityName(e.target.value)}
                      placeholder="e.g. My Home Bhooja"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 text-xs text-forest-900 placeholder:text-forest-400 focus:bg-white focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10 transition-all duration-200 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-leaf-600" />
                    <span>How did you hear about us? <span className="text-leaf-600">*</span></span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 text-xs text-forest-900 focus:bg-white focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10 transition-all duration-200 font-medium appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select option...
                      </option>
                      {HEAR_ABOUT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: Address & Locality */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Address & Locality / City <span className="text-leaf-600">*</span>
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-3.5 top-2.5 w-4 h-4 text-forest-400 group-focus-within:text-leaf-600 transition-colors" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Financial District, Nanakramguda, Hyderabad - 500032"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 text-xs text-forest-900 placeholder:text-forest-400 focus:bg-white focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10 transition-all duration-200 font-medium"
                  />
                </div>
              </div>

              {/* Row 4: Relevant Details */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-leaf-600" />
                    <span>Relevant Details & Preferences</span>
                  </span>
                  <span className="text-[10px] text-forest-500 font-normal">Optional</span>
                </label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Approx 150 flats, preference for weekend mornings, fresh vegetables & cold-pressed oils..."
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 text-xs text-forest-900 placeholder:text-forest-400 focus:bg-white focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10 transition-all duration-200 font-medium"
                />
              </div>

              {/* CTA Action */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-leaf-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/35 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <MessageCircle className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                  <span>Send Request via WhatsApp</span>
                </button>

                <div className="flex items-center justify-between px-1 text-[11px] text-forest-600">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-leaf-600" />
                    <span>Direct farm coordinator • Zero spam</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="hover:text-forest-950 underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
