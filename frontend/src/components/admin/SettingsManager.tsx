'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CompanySettings } from '@/types';
import { updateCompanySettingsAction } from '@/actions/settings';
import { storageService } from '@/services/storage';
import {
  Settings,
  Save,
  Loader2,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  MapPin,
  Upload,
  Globe,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { notifyStoreUpdate } from '@/utils/storeEvents';

interface SettingsManagerProps {
  settings: CompanySettings;
  onSettingsUpdated: () => void;
}

export function SettingsManager({ settings, onSettingsUpdated }: SettingsManagerProps) {
  const [companyName, setCompanyName] = useState(settings.companyName || 'Vikrshi Suppliers Pvt Ltd');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '/logo.png');
  const [logoPath, setLogoPath] = useState(settings.logoPath || '');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '919441469814');
  const [phoneNumber, setPhoneNumber] = useState(settings.phone || settings.phoneNumber || '+91 94414 69814');
  const [email, setEmail] = useState(settings.email || 'contact@vikrshi.com');
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || 'https://instagram.com/vikrshi');
  const [address, setAddress] = useState(settings.address?.fullText || 'H-No. 2-41/1, Zapthi Singaipalli, Cheelasagar, Mulugu Mandal, Siddipet, Telangana 502279-India.');
  const [businessHours, setBusinessHours] = useState(settings.businessHours?.fullText || 'Monday – Saturday: 6:00 AM – 8:00 PM');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(settings.googleMapsUrl || 'https://maps.google.com/?q=Hyderabad');
  const [footerDescription, setFooterDescription] = useState(settings.footerDescription || settings.shortDescription || '');
  const [seoTitle, setSeoTitle] = useState(settings.seoTitle || 'Vikrshi Suppliers Pvt Ltd | Fresh Organic Produce from Farm to Home');
  const [seoDescription, setSeoDescription] = useState(settings.seoDescription || '');
  const [orderingEnabled, setOrderingEnabled] = useState(settings.orderingEnabled !== false);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const toastId = toast.loading('Uploading company logo...');
    try {
      const res = await storageService.uploadCompanyImage(file);
      setLogoUrl(res.imageUrl);
      setLogoPath(res.imagePath);
      toast.success('Company logo uploaded', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Logo upload failed', { id: toastId });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await updateCompanySettingsAction({
        companyName,
        logoUrl,
        logoPath,
        whatsappNumber,
        phoneNumber,
        email,
        instagramUrl,
        address,
        businessHours,
        googleMapsUrl,
        footerDescription,
        seoTitle,
        seoDescription,
        orderingEnabled,
      });

      if (res.success) {
        toast.success('Company settings saved successfully!');
        notifyStoreUpdate('settings');
        onSettingsUpdated();
      } else {
        toast.error(res.error || 'Failed to update company settings');
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-xs">
        <h2 className="font-serif text-2xl font-bold text-forest-950">
          Store Settings & Company Information
        </h2>
        <p className="text-xs text-forest-600 mt-1">
          Manage store branding, contact information, hours, and addresses. Updates propagate across the storefront in real time.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-xs space-y-6">
        {/* Brand identity & Logo */}
        <div>
          <h3 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-3">
            1. Brand Identity & Logo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Company Legal Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Ordering Flow Enabled
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="orderingEnabled"
                  checked={orderingEnabled}
                  onChange={(e) => setOrderingEnabled(e.target.checked)}
                  className="rounded border-cream-300 text-leaf-600 focus:ring-leaf-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="orderingEnabled" className="text-xs text-forest-800 cursor-pointer">
                  Accept WhatsApp Orders
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-forest-900 mb-1">
              Company Logo
            </label>
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-xl bg-white p-1 overflow-hidden shrink-0 border border-cream-200 shadow-sm flex items-center justify-center">
                {logoUrl && (
                  <Image src={logoUrl} alt="Logo preview" fill className="object-contain" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-800 text-xs font-medium cursor-pointer transition-colors border border-cream-300">
                  {isUploadingLogo ? (
                    <Loader2 className="w-4 h-4 animate-spin text-leaf-600" />
                  ) : (
                    <Upload className="w-4 h-4 text-leaf-600" />
                  )}
                  <span>{isUploadingLogo ? 'Uploading logo...' : 'Upload Logo'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Or enter public logo URL"
                  className="w-full px-3 py-1.5 rounded-lg border border-cream-200 text-[11px] text-forest-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp & Contact Lines */}
        <div className="pt-4 border-t border-cream-200">
          <h3 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>2. WhatsApp Order Dispatch & Contact Lines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Primary WhatsApp Number *
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="919441469814"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 font-mono font-medium"
              />
              <span className="text-[10px] text-forest-500 mt-1 block">
                Digits with country code (e.g. 919441469814)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 94414 69814"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Support Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@vikrshi.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
              />
            </div>
          </div>
        </div>

        {/* Location & Social */}
        <div className="pt-4 border-t border-cream-200">
          <h3 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-3">
            3. Address, Hours & Social
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Headquarters Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="H-No. 2-41/1, Zapthi Singaipalli, Cheelasagar, Mulugu Mandal, Siddipet..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Operating / Dispatch Hours
                </label>
                <input
                  type="text"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  placeholder="Monday – Saturday: 6:00 AM – 8:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/vikrshi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Google Maps Embed / Navigation URL
              </label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Footer Brand Summary
              </label>
              <textarea
                rows={2}
                value={footerDescription}
                onChange={(e) => setFooterDescription(e.target.value)}
                placeholder="Displayed in the website footer across all pages..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="pt-4 border-t border-cream-200">
          <h3 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-3">
            4. Global SEO & Meta Tags
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Default Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Default Meta Description
              </label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-cream-200 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Company Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
