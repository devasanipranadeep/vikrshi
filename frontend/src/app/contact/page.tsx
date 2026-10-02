'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSettings } from '@/context/SettingsContext';
import { useLocation } from '@/context/LocationContext';
import { contactService } from '@/services/contactService';
import { buildGeneralWhatsAppUrl } from '@/utils/whatsapp';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Building,
  Sprout,
  HelpCircle,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid 10-digit mobile number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  location: z.string().min(2, 'Please specify your location or neighborhood in Hyderabad'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { settings } = useSettings();
  const { activeLocations, selectedLocation } = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Identify the company's default location
  const defaultLocationName = settings.defaultLocation || 'Hyderabad';
  const defaultLoc =
    activeLocations.find((l) => l.isDefault) ||
    activeLocations.find(
      (l) => l.cityName.toLowerCase() === defaultLocationName.toLowerCase()
    ) ||
    activeLocations[0];

  // Active map location tab (defaults automatically to the company's default location)
  const [selectedMapCity, setSelectedMapCity] = useState<string>(
    defaultLoc?.cityName || defaultLocationName
  );

  // Keep selectedMapCity synced whenever default location or active locations change
  useEffect(() => {
    if (defaultLoc?.cityName) {
      if (!activeLocations.some((l) => l.cityName.toLowerCase() === selectedMapCity.toLowerCase())) {
        setSelectedMapCity(defaultLoc.cityName);
      }
    }
  }, [defaultLoc?.cityName, activeLocations, selectedMapCity]);

  // The location being rendered on the map
  const activeMapLocation =
    activeLocations.find(
      (l) => l.cityName.toLowerCase() === selectedMapCity.toLowerCase()
    ) || defaultLoc;

  const isDefaultLocation =
    !activeMapLocation ||
    activeMapLocation.cityName.toLowerCase() === (defaultLoc?.cityName || defaultLocationName).toLowerCase();

  // Dynamic address: for the company's default location, use the company settings headquarters address
  // For regional hubs, use that hub's specific address
  const displayedAddress = isDefaultLocation
    ? settings.address.fullText ||
      settings.address.line1 ||
      activeMapLocation?.hubAddress ||
      activeMapLocation?.address ||
      `${defaultLocationName}, Telangana, India`
    : activeMapLocation?.hubAddress ||
      activeMapLocation?.address ||
      `${activeMapLocation?.cityName}, ${activeMapLocation?.state || 'Telangana'}, India`;

  const displayedTitle = isDefaultLocation
    ? `${settings.companyName} Headquarters & Central Distribution Hub`
    : `${activeMapLocation?.cityName} Regional Distribution Depot`;

  // Compute map URLs dynamically
  const { mapEmbedUrl, mapExternalUrl } = useMemo(() => {
    // 1. If viewing the default company location and admin has provided a custom googleMapsUrl in Company Settings
    if (isDefaultLocation && settings.googleMapsUrl && settings.googleMapsUrl.trim()) {
      const customUrl = settings.googleMapsUrl.trim();

      // Check if admin pasted an iframe snippet
      const iframeSrc = customUrl.match(/src=["']([^"']+)["']/)?.[1];
      if (iframeSrc) {
        return {
          mapEmbedUrl: iframeSrc,
          mapExternalUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayedAddress)}`,
        };
      }

      // Check if already an embed URL
      if (customUrl.includes('/maps/embed') || customUrl.includes('output=embed')) {
        return {
          mapEmbedUrl: customUrl,
          mapExternalUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayedAddress)}`,
        };
      }

      // If URL has query param ?q=
      try {
        const parsed = new URL(customUrl);
        const q = parsed.searchParams.get('q') || parsed.searchParams.get('query');
        if (q) {
          return {
            mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=14&ie=UTF8&iwloc=&output=embed`,
            mapExternalUrl: customUrl,
          };
        }
      } catch {
        // Not a URL with searchParams
      }
    }

    // 2. If the location record has specific GPS coordinates (latitude / longitude)
    if (
      activeMapLocation?.latitude &&
      activeMapLocation?.longitude &&
      !isNaN(Number(activeMapLocation.latitude)) &&
      !isNaN(Number(activeMapLocation.longitude))
    ) {
      const coords = `${activeMapLocation.latitude},${activeMapLocation.longitude}`;
      return {
        mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(coords)}&t=&z=14&ie=UTF8&iwloc=&output=embed`,
        mapExternalUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}`,
      };
    }

    // 3. Fallback to clean address query
    const cleanQuery = displayedAddress.replace(/\s+/g, ' ').trim() || `${activeMapLocation?.cityName || defaultLocationName}, India`;
    return {
      mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(cleanQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`,
      mapExternalUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanQuery)}`,
    };
  }, [isDefaultLocation, settings.googleMapsUrl, displayedAddress, activeMapLocation, defaultLocationName]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      location: selectedLocation,
    },
  });

  const onSubmit = async (data: ContactFormInputs) => {
    setIsSubmitting(true);
    try {
      const response = await contactService.submitContact(data);
      if (response.success) {
        setSubmittedTicket(response.ticketId || 'VKR-ONLINE');
        toast.success(response.message || 'Inquiry submitted successfully!');
        reset();
      } else {
        toast.error(response.message || 'Failed to submit form');
      }
    } catch {
      toast.error('Network error submitting contact request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = buildGeneralWhatsAppUrl({
    phone: settings.whatsappNumber,
    companyName: settings.companyName,
    location: selectedLocation,
  });

  return (
    <div className="pt-24 pb-20 bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="rounded-3xl bg-forest-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden mb-12 border border-leaf-500/20">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-300 bg-leaf-500/20 px-3.5 py-1 rounded-full inline-block border border-leaf-400/30">
              Get In Touch
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Connect With Vikrshi Farms
            </h1>
            <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed">
              Have questions about our morning harvest delivery, weekly family subscription crates, zero-pesticide certifications, or weekend farm walks? We’d love to hear from you.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-leaf-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick WhatsApp Action Card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] p-6 text-white shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                <h3 className="font-serif text-xl font-bold">Fastest Response: WhatsApp</h3>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
                Our farm hub coordinator responds within minutes during harvesting hours (6:00 AM – 8:30 PM).
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white text-forest-900 px-5 py-2.5 text-xs font-bold shadow-md hover:bg-cream-100 transition-colors"
              >
                <span>Chat on WhatsApp ({settings.whatsappDisplay})</span>
              </a>
            </div>

            {/* Farm Office Details */}
            <div className="rounded-2xl bg-white p-6 border border-cream-200 shadow-2xs space-y-5">
              <h3 className="font-serif text-xl font-bold text-forest-950">
                Official Farm Hub & Office
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-forest-800">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-forest-950">Central Sorting Hub</h5>
                    <p className="text-xs text-forest-700/80 leading-relaxed mt-0.5">
                      {settings.address.fullText || settings.address.line1}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-600">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-forest-950">Direct Phone</h5>
                    <a href={`tel:${settings.phone}`} className="text-xs text-leaf-600 font-semibold hover:underline block mt-0.5">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-600">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-forest-950">Email Support</h5>
                    <a href={`mailto:${settings.email}`} className="text-xs text-leaf-600 font-semibold hover:underline block mt-0.5">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-forest-950">Operating Hours</h5>
                    <p className="text-xs text-forest-700/80 leading-relaxed mt-0.5">
                      {settings.businessHours.fullText || `${settings.businessHours.weekdays} (Weekdays)`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                    <InstagramIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-forest-950">Instagram</h5>
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-pink-600 font-semibold hover:underline block mt-0.5"
                    >
                      {settings.instagramHandle}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Serving Locations Banner */}
            <div className="rounded-2xl bg-cream-100 p-5 border border-cream-200 text-xs text-forest-800">
              <span className="font-bold text-forest-950 block mb-1">
                Active Delivery Cities:
              </span>
              <p className="leading-relaxed">
                {activeLocations.map((l) => `${l.cityName} (${l.state})`).join(' • ')}
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white p-6 sm:p-10 border border-cream-200 shadow-2xs">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-forest-700/80 mb-6">
                Fill in your details below and our customer care team will get back to you promptly.
              </p>

              {submittedTicket ? (
                <div className="rounded-2xl bg-leaf-50 p-6 border border-leaf-200 text-center space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-leaf-500 mx-auto" />
                  <h4 className="font-serif text-xl font-bold text-forest-950">
                    Inquiry Received!
                  </h4>
                  <p className="text-xs sm:text-sm text-forest-700/80 max-w-md mx-auto">
                    Your reference ticket is <strong className="text-leaf-600">{submittedTicket}</strong>. We will review your message and contact your phone or WhatsApp shortly.
                  </p>
                  <button
                    onClick={() => setSubmittedTicket(null)}
                    className="mt-4 inline-block text-xs font-bold text-leaf-600 hover:underline cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-forest-950 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Reddy"
                        {...register('name')}
                        className="w-full rounded-xl bg-cream-50 border border-cream-300 py-2.5 px-3.5 text-xs sm:text-sm text-forest-950 focus:border-leaf-500 focus:outline-none"
                      />
                      {errors.name && (
                        <p className="mt-1 text-[11px] text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-forest-950 mb-1">
                        Mobile / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        {...register('phone')}
                        className="w-full rounded-xl bg-cream-50 border border-cream-300 py-2.5 px-3.5 text-xs sm:text-sm text-forest-950 focus:border-leaf-500 focus:outline-none"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-[11px] text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-forest-950 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. ramesh@example.com"
                        {...register('email')}
                        className="w-full rounded-xl bg-cream-50 border border-cream-300 py-2.5 px-3.5 text-xs sm:text-sm text-forest-950 focus:border-leaf-500 focus:outline-none"
                      />
                      {errors.email && (
                        <p className="mt-1 text-[11px] text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Delivery Location / Area */}
                    <div>
                      <label className="block text-xs font-bold text-forest-950 mb-1">
                        Your Location / Neighborhood *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Jubilee Hills, Hyderabad"
                        {...register('location')}
                        className="w-full rounded-xl bg-cream-50 border border-cream-300 py-2.5 px-3.5 text-xs sm:text-sm text-forest-950 focus:border-leaf-500 focus:outline-none"
                      />
                      {errors.location && (
                        <p className="mt-1 text-[11px] text-red-600">{errors.location.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-forest-950 mb-1">
                      Subject *
                    </label>
                    <select
                      {...register('subject')}
                      className="w-full rounded-xl bg-cream-50 border border-cream-300 py-2.5 px-3.5 text-xs sm:text-sm text-forest-950 focus:border-leaf-500 focus:outline-none"
                    >
                      <option value="Home Delivery Inquiry">Home Delivery & Slots Inquiry</option>
                      <option value="Weekly Farm Subscription Box">Weekly Family Subscription Box</option>
                      <option value="Weekend Farm Tour Booking">Weekend Farm Tour Booking (Chevella)</option>
                      <option value="Farmer Partnership Request">Farmer Partnership / Sourcing</option>
                      <option value="Bulk Order for Event/Restaurant">Bulk Farm Order for Event or Cafe</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-forest-950 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please let us know your requirements or delivery preferences..."
                      {...register('message')}
                      className="w-full rounded-xl bg-cream-50 border border-cream-300 py-2.5 px-3.5 text-xs sm:text-sm text-forest-950 focus:border-leaf-500 focus:outline-none"
                    />
                    {errors.message && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white py-3.5 px-6 font-semibold text-xs sm:text-sm shadow-md transition-colors cursor-pointer disabled:opacity-70"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? 'Sending Request...' : 'Submit Farm Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Map Preview Section */}
        <div className="mt-16 rounded-3xl overflow-hidden bg-white border border-cream-200 shadow-2xs p-6 sm:p-8">
          {/* Header & Location Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-cream-200">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-leaf-700 bg-leaf-100/60 px-2.5 py-0.5 rounded-full border border-leaf-200/60 inline-flex items-center gap-1.5">
                  <Navigation className="h-3 w-3" />
                  Company Location & Logistics
                </span>
                {isDefaultLocation && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-300/60">
                    Default Headquarters
                  </span>
                )}
              </div>
              <h3 className="font-serif text-2xl font-bold text-forest-950">
                {displayedTitle}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-forest-700/80 mt-1">
                <MapPin className="h-3.5 w-3.5 text-leaf-600 shrink-0" />
                <span>{displayedAddress}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Location tabs if multiple locations exist */}
              {activeLocations.length > 1 && (
                <div className="flex items-center gap-1 p-1 bg-cream-100 rounded-xl border border-cream-200">
                  {activeLocations.map((loc) => {
                    const isSelected = loc.cityName.toLowerCase() === (activeMapLocation?.cityName || '').toLowerCase();
                    const isLocDefault = loc.cityName.toLowerCase() === defaultLocationName.toLowerCase() || loc.isDefault;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setSelectedMapCity(loc.cityName)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-forest-900 text-white shadow-xs'
                            : 'text-forest-700 hover:text-forest-950 hover:bg-cream-200/60'
                        }`}
                      >
                        {loc.cityName}
                        {isLocDefault && <span className="ml-1 opacity-70 text-[10px]">• HQ</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              <a
                href={mapExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-leaf-700 bg-leaf-50 hover:bg-leaf-100/80 border border-leaf-200 px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                <MapPin className="h-3.5 w-3.5 text-leaf-600" />
                <span>Open in Google Maps</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Quick Hub Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-forest-700/80 mb-4 px-1">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-forest-500" />
              <span>
                Dispatch Hours:{' '}
                <strong className="text-forest-900 font-medium">
                  {activeMapLocation?.operatingHours || settings.businessHours.fullText || settings.businessHours.weekdays || '6:00 AM – 8:00 PM'}
                </strong>
              </span>
            </div>
            {activeMapLocation?.deliveryAreas && activeMapLocation.deliveryAreas.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf-500" />
                <span>
                  Delivery Coverage:{' '}
                  <strong className="text-forest-900 font-medium">
                    {activeMapLocation.deliveryAreas.slice(0, 4).join(', ')}
                    {activeMapLocation.deliveryAreas.length > 4 ? ` +${activeMapLocation.deliveryAreas.length - 4} more zones` : ''}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Map Iframe */}
          <div className="relative aspect-21/9 min-h-[300px] w-full rounded-2xl overflow-hidden bg-cream-200 border border-cream-200 shadow-inner">
            <iframe
              key={mapEmbedUrl}
              title={`${displayedTitle} Map`}
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-20 contrast-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
