'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { buildCommunityRequestWhatsAppUrl } from '@/utils/whatsapp';
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

export function CommunityRequestModal() {
  const { settings } = useSettings();
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Form states
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [address, setAddress] = useState('');
  const [source, setSource] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    // Check if dismissed previously in this browser session
    const hasDismissed = sessionStorage.getItem('vikrshi_community_popup_dismissed');
    if (hasDismissed === 'true') {
      return;
    }

    // Trigger popup after exactly 7 seconds of landing on the site
    const timer = setTimeout(() => {
      const isStillDismissed = sessionStorage.getItem('vikrshi_community_popup_dismissed');
      if (isStillDismissed !== 'true') {
        setIsRendered(true);
        // Small delay to allow DOM render before triggering CSS smooth opacity/transform
        requestAnimationFrame(() => {
          setTimeout(() => setIsVisible(true), 30);
        });
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    // Smooth exit transition
    setIsVisible(false);
    sessionStorage.setItem('vikrshi_community_popup_dismissed', 'true');
    setTimeout(() => {
      setIsRendered(false);
    }, 350);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicantName.trim() || !communityName.trim() || !address.trim() || !source) {
      toast.error('Please fill in all required fields.');
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

    sessionStorage.setItem('vikrshi_community_popup_dismissed', 'true');
    setIsSubmitted(true);
    toast.success('Redirecting to WhatsApp with your community request...');

    // Open WhatsApp in new tab
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    // Smoothly exit after success acknowledgement
    setTimeout(() => {
      handleClose();
    }, 2200);
  };

  if (!isRendered) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 transition-all duration-350 ease-out overflow-y-auto ${
        isVisible
          ? 'bg-forest-950/65 backdrop-blur-md opacity-100'
          : 'bg-forest-950/0 backdrop-blur-none opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        // Close when clicking directly on backdrop
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-lg bg-white rounded-3xl sm:rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(20,50,30,0.35)] border border-cream-200/90 overflow-hidden my-auto transform transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible
            ? 'scale-100 translate-y-0 opacity-100'
            : 'scale-95 translate-y-6 opacity-0'
        }`}
      >
        {/* Top Gradient Accent Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-leaf-400 to-gold-400" />

        {/* Modal Header */}
        <div className="relative bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white p-6 sm:p-7 overflow-hidden">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -right-8 -top-8 w-44 h-44 bg-leaf-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close button with rotate on hover */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-cream-200/70 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-200 cursor-pointer group"
            aria-label="Close community request popup"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="relative z-10 space-y-2.5">
            {/* Pulsing Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leaf-500/20 text-leaf-300 border border-leaf-400/30 text-[11px] font-semibold tracking-wide backdrop-blur-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Community & Society Deliveries</span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              Bring Farm-Fresh Harvests{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-300 via-emerald-200 to-leaf-400">
                to Your Community
              </span>
            </h2>

            <p className="text-xs sm:text-[13px] text-cream-100/80 leading-relaxed max-w-md">
              Are you a resident, society committee member, or community lead? Request a dedicated direct-from-farm harvest delivery schedule or weekly organic pop-up for your apartments.
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[72vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="py-10 text-center space-y-3.5 animate-in fade-in zoom-in-95 duration-300">
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
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Applicant Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1.5">
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
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 text-xs text-forest-900 placeholder:text-forest-400 focus:bg-white focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10 transition-all duration-200 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1.5 flex items-center justify-between">
                    <span>Phone / WhatsApp</span>
                    <span className="text-[10px] text-forest-500 font-normal">Optional</span>
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 group-focus-within:text-leaf-600 transition-colors" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 text-xs text-forest-900 placeholder:text-forest-400 focus:bg-white focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10 transition-all duration-200 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Community Name */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1.5">
                  Community / Apartment / Society Name <span className="text-leaf-600">*</span>
                </label>
                <div className="relative group">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 group-focus-within:text-leaf-600 transition-colors" />
                  <input
                    type="text"
                    required
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    placeholder="e.g. My Home Bhooja, Aparna Sarovar, Rainbow Vistas"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 text-xs text-forest-900 placeholder:text-forest-400 focus:bg-white focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10 transition-all duration-200 font-medium"
                  />
                </div>
              </div>

              {/* Address / Location */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1.5">
                  Address & Locality / City <span className="text-leaf-600">*</span>
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-forest-400 group-focus-within:text-leaf-600 transition-colors" />
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Financial District, Nanakramguda, Hyderabad - 500032"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 text-xs text-forest-900 placeholder:text-forest-400 focus:bg-white focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10 transition-all duration-200 font-medium"
                  />
                </div>
              </div>

              {/* How did you hear about us? */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-leaf-600" />
                  <span>How did you hear about us? <span className="text-leaf-600">*</span></span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 text-xs text-forest-900 focus:bg-white focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10 transition-all duration-200 font-medium appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select how you heard about us...
                    </option>
                    {HEAR_ABOUT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400 pointer-events-none" />
                </div>
              </div>

              {/* Relevant Details */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-leaf-600" />
                    <span>Relevant Details & Preferences</span>
                  </span>
                  <span className="text-[10px] text-forest-500 font-normal">Optional</span>
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Approx 150 flats, preference for weekend morning deliveries, interested in organic vegetables, cold-pressed oils..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-200 bg-cream-50/50 hover:bg-cream-50/80 text-xs text-forest-900 placeholder:text-forest-400 focus:bg-white focus:outline-none focus:border-leaf-500 focus:ring-4 focus:ring-leaf-500/10 transition-all duration-200 font-medium"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-leaf-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/35 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group"
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
