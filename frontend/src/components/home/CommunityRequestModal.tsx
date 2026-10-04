'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { buildCommunityRequestWhatsAppUrl } from '@/utils/whatsapp';
import {
  Users2,
  X,
  MessageCircle,
  Building2,
  MapPin,
  Phone,
  User,
  Sparkles,
  Megaphone,
  FileText,
  CheckCircle2,
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
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form states
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [address, setAddress] = useState('');
  const [source, setSource] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    // Check if dismissed previously in this session
    const hasDismissed = sessionStorage.getItem('vikrshi_community_popup_dismissed');
    if (hasDismissed === 'true') {
      return;
    }

    // Trigger popup after exactly 10 seconds of landing on the site
    const timer = setTimeout(() => {
      const isStillDismissed = sessionStorage.getItem('vikrshi_community_popup_dismissed');
      if (isStillDismissed !== 'true') {
        setIsOpen(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('vikrshi_community_popup_dismissed', 'true');
  };

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

    // Mark dismissed in session
    sessionStorage.setItem('vikrshi_community_popup_dismissed', 'true');
    setIsSubmitted(true);
    toast.success('Redirecting to WhatsApp to send your community request...');

    // Open WhatsApp in new tab
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    // Close modal smoothly after brief success acknowledgement
    setTimeout(() => {
      setIsOpen(false);
    }, 2400);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-forest-950/70 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden my-auto animate-in zoom-in-95 duration-300">
        {/* Decorative Top Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-leaf-500 via-emerald-400 to-leaf-600" />

        {/* Modal Header */}
        <div className="relative bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white p-5 sm:p-6 overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute right-0 top-0 -mt-6 -mr-6 w-36 h-36 bg-leaf-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-cream-200/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close community request popup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/20 text-leaf-300 border border-leaf-400/30 text-[11px] font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-leaf-300" />
              <span>Community & Society Deliveries</span>
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
              Bring Fresh Organic Harvests to Your Community!
            </h2>

            <p className="text-xs sm:text-sm text-cream-100/80 leading-relaxed max-w-md">
              Are you a resident, society committee member, or community lead? Request a dedicated direct-from-farm harvest delivery slot or weekly organic pop-up for your apartments.
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-950">
                Opening WhatsApp...
              </h3>
              <p className="text-xs text-forest-600 max-w-sm mx-auto">
                Your community request details have been prepared. Please press send in WhatsApp to connect directly with our farm dispatch team!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Applicant Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 text-xs text-forest-900 placeholder:text-forest-400 focus:outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 text-xs text-forest-900 placeholder:text-forest-400 focus:outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                    />
                  </div>
                </div>
              </div>

              {/* Community Name */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Community / Society / Apartment Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                  <input
                    type="text"
                    required
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    placeholder="e.g. My Home Bhooja, Aparna Sarovar, Rainbow Vistas"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 text-xs text-forest-900 placeholder:text-forest-400 focus:outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                  />
                </div>
              </div>

              {/* Address / Location */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Address & Locality / City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-forest-400" />
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Financial District, Nanakramguda, Hyderabad - 500032"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 text-xs text-forest-900 placeholder:text-forest-400 focus:outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                  />
                </div>
              </div>

              {/* How did you hear about us? */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1 flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-leaf-600" />
                  <span>How did you hear about us? *</span>
                </label>
                <select
                  required
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs text-forest-900 bg-white focus:outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500 font-medium"
                >
                  <option value="" disabled>
                    Select an option...
                  </option>
                  {HEAR_ABOUT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Relevant Details */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-leaf-600" />
                    <span>Relevant Details & Requirements (Optional)</span>
                  </span>
                  <span className="text-[10px] text-forest-500">Optional</span>
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="e.g. Approx 150 flats, preference for weekend morning deliveries, interested in organic vegetables, cold-pressed oils, and A2 milk..."
                  className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs text-forest-900 placeholder:text-forest-400 focus:outline-none focus:border-leaf-500 focus:ring-1 focus:ring-leaf-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send Request via WhatsApp</span>
                </button>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-forest-500">
                    🔒 Zero spam • Direct farm dispatch coordinator
                  </span>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-[11px] text-forest-600 hover:text-forest-900 underline cursor-pointer"
                  >
                    Maybe later
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
