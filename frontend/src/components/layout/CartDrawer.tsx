'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useSettings } from '@/context/SettingsContext';
import { buildMultiProductWhatsAppUrl } from '@/utils/whatsapp';
import { formatCurrency } from '@/utils/formatters';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  MapPin,
  Send,
  MessageCircle,
  Sparkles,
  Home,
  Building,
  Navigation,
  User,
  Phone,
  Clock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

const DELIVERY_STORAGE_KEY = 'vikrshi_delivery_details_v1';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, clearCart, totalItems, totalAmount } =
    useCart();
  const { selectedLocation, openLocationSelector } = useLocation();
  const { settings } = useSettings();

  const [houseNumber, setHouseNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Load saved delivery address details from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DELIVERY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.houseNumber) setHouseNumber(parsed.houseNumber);
        if (parsed.streetAddress) setStreetAddress(parsed.streetAddress);
        if (parsed.landmark) setLandmark(parsed.landmark);
        if (parsed.pincode) setPincode(parsed.pincode);
        if (parsed.customerName) setCustomerName(parsed.customerName);
        if (parsed.customerPhone) setCustomerPhone(parsed.customerPhone);
        if (parsed.customerNote) setCustomerNote(parsed.customerNote);
      }
    } catch (e) {
      console.warn('Failed reading delivery details from localStorage', e);
    }
  }, []);

  const validateDeliveryForm = () => {
    const errs: Record<string, string> = {};

    if (!houseNumber.trim()) {
      errs.houseNumber = 'House / Flat number is required';
    }
    if (!streetAddress.trim()) {
      errs.streetAddress = 'Street / Society / Area is required';
    }
    if (!pincode.trim() || pincode.trim().length < 6) {
      errs.pincode = 'Valid 6-digit pincode is required';
    }
    if (!customerName.trim()) {
      errs.customerName = 'Your name is required';
    }
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.customerPhone = '10-digit phone required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0 || isPlacingOrder) return;

    // Validate delivery details
    if (!validateDeliveryForm()) {
      toast.error('Please enter your house number and delivery details', {
        description: 'Our farm team needs your exact house address for morning dispatch.',
      });
      const section = document.getElementById('delivery-details-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Save details to localStorage for next time
    try {
      localStorage.setItem(
        DELIVERY_STORAGE_KEY,
        JSON.stringify({
          houseNumber,
          streetAddress,
          landmark,
          pincode,
          customerName,
          customerPhone,
          customerNote,
        })
      );
    } catch {}

    setIsPlacingOrder(true);
    const toastId = toast.loading('Preparing verified harvest dispatch with delivery address...');

    const deliveryPayload = {
      houseNumber: houseNumber.trim(),
      streetAddress: streetAddress.trim(),
      landmark: landmark.trim() || undefined,
      pincode: pincode.trim(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
    };

    try {
      // 1. Secure Server-side Inquiry Creation
      const { createWhatsAppOrderAction } = await import('@/actions/orders');
      const res = await createWhatsAppOrderAction({
        locationId: selectedLocation,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        houseNumber: houseNumber.trim(),
        streetAddress: streetAddress.trim(),
        landmark: landmark.trim() || undefined,
        pincode: pincode.trim(),
        customerNote: customerNote.trim() || undefined,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      });

      // Joyful celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2D6A4F', '#52B788', '#F4A261', '#E9C46A'],
        });
      } catch {}

      toast.success('Order inquiry recorded! Opening WhatsApp...', { id: toastId });

      let targetUrl = res.whatsappUrl;
      if (!targetUrl) {
        targetUrl = buildMultiProductWhatsAppUrl({
          phone: settings.whatsappNumber,
          companyName: settings.companyName,
          items,
          location: selectedLocation,
          customerNote: customerNote.trim() || undefined,
          deliveryDetails: deliveryPayload,
        });
      }

      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      console.warn('Fallback to direct WhatsApp link:', err);
      const fallbackUrl = buildMultiProductWhatsAppUrl({
        phone: settings.whatsappNumber,
        companyName: settings.companyName,
        items,
        location: selectedLocation,
        customerNote: customerNote.trim() || undefined,
        deliveryDetails: deliveryPayload,
      });
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      toast.success('Redirecting to WhatsApp...', { id: toastId });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="fixed inset-0 bg-forest-950/60 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="w-screen max-w-md bg-cream-50 shadow-2xl flex flex-col border-l border-leaf-100"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-cream-200 bg-white/85 backdrop-blur-md shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-500/10 text-leaf-500">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold text-forest-900">
                      Your Order List
                    </h2>
                    <p className="text-xs text-forest-700/70">
                      {totalItems} item{totalItems !== 1 ? 's' : ''} ready for farm dispatch
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeCart}
                  className="rounded-full p-2 text-forest-900/60 hover:bg-cream-200 hover:text-forest-900 transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Delivery location bar */}
              <div className="mt-3 flex items-center justify-between rounded-xl bg-leaf-50/70 px-3.5 py-2 border border-leaf-100/60 text-xs">
                <div className="flex items-center gap-1.5 text-forest-900">
                  <MapPin className="h-3.5 w-3.5 text-leaf-500" />
                  <span>Delivering to: <strong className="font-semibold text-leaf-600">{selectedLocation}</strong></span>
                </div>
                <button
                  onClick={openLocationSelector}
                  className="text-leaf-500 hover:text-leaf-600 font-medium underline cursor-pointer"
                >
                  Change Hub
                </button>
              </div>
            </div>

            {/* Content / Items & Delivery Form */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-leaf-50 text-leaf-400 mb-4">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-forest-900">
                    Your order list is empty
                  </h3>
                  <p className="mt-2 text-xs text-forest-700/70 max-w-xs leading-relaxed">
                    Explore our morning harvest of fresh vegetables, leafy greens, and sun-ripened orchard fruits.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-leaf-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-leaf-600 transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    Browse Fresh Products
                  </Link>
                </div>
              ) : (
                <>
                  {/* WhatsApp Direct Order Notice */}
                  <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-3 text-xs text-emerald-900 flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Direct Farm Dispatch:</strong> No online payment required. Your order and house address are formatted and dispatched directly to our WhatsApp farm manager.
                    </p>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-3 rounded-xl border border-cream-200 bg-white p-3 shadow-xs hover:border-leaf-200 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="72px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-forest-900 truncate">
                                  {item.product.name}
                                </h4>
                                {(!item.product.inStock || item.product.availabilityStatus === 'out_of_stock') && (
                                  <span className="inline-block mt-0.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                                    Sold Out
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-forest-700/40 hover:text-red-500 transition-colors p-1 shrink-0 cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-xs text-forest-700/70">
                              {formatCurrency(item.product.price)} / {item.product.unit}
                            </p>
                          </div>

                          {/* Quantity control */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-cream-100">
                            <div className="flex items-center rounded-lg border border-cream-300 bg-cream-50">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 hover:bg-cream-200 text-forest-900 transition-colors rounded-l-lg cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-forest-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 hover:bg-cream-200 text-forest-900 transition-colors rounded-r-lg cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <span className="text-sm font-bold text-leaf-600">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={clearCart}
                      className="text-xs text-forest-700/60 hover:text-red-500 transition-colors underline cursor-pointer"
                    >
                      Clear order list
                    </button>
                  </div>

                  {/* Delivery Address & House Details Form */}
                  <div id="delivery-details-section" className="rounded-2xl border border-leaf-200/80 bg-white p-4 shadow-2xs space-y-3.5 pt-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-cream-200/80">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-leaf-100 text-leaf-700">
                        <Home className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-950 flex items-center gap-1.5">
                          Delivery Address & Contact
                          <span className="text-[10px] font-bold text-red-500 uppercase">Required</span>
                        </h4>
                        <p className="text-[11px] text-forest-600">
                          Enter your house number & address for morning farm dispatch
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* House / Flat Number */}
                      <div>
                        <label className="block text-[11px] font-semibold text-forest-900 mb-1 flex items-center justify-between">
                          <span>House / Flat / Door No. <span className="text-red-500">*</span></span>
                          {errors.houseNumber && <span className="text-[10px] text-red-500 font-medium">{errors.houseNumber}</span>}
                        </label>
                        <div className="relative">
                          <Home className="absolute left-3 top-2.5 h-3.5 w-3.5 text-leaf-600/70" />
                          <input
                            type="text"
                            placeholder="e.g. Flat 402, Block B or H-No. 2-41/1"
                            value={houseNumber}
                            onChange={(e) => {
                              setHouseNumber(e.target.value);
                              if (errors.houseNumber) setErrors((prev) => ({ ...prev, houseNumber: '' }));
                            }}
                            className={`w-full rounded-xl bg-cream-50/70 border pl-9 pr-3 py-2 text-xs text-forest-900 placeholder:text-forest-700/40 focus:outline-none focus:bg-white transition-all ${
                              errors.houseNumber ? 'border-red-400 ring-1 ring-red-400' : 'border-cream-300 focus:border-leaf-500'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Street / Society / Area */}
                      <div>
                        <label className="block text-[11px] font-semibold text-forest-900 mb-1 flex items-center justify-between">
                          <span>Apartment / Street / Society <span className="text-red-500">*</span></span>
                          {errors.streetAddress && <span className="text-[10px] text-red-500 font-medium">{errors.streetAddress}</span>}
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-2.5 h-3.5 w-3.5 text-leaf-600/70" />
                          <input
                            type="text"
                            placeholder="e.g. Rainbow Vistas, Hitech City Main Road"
                            value={streetAddress}
                            onChange={(e) => {
                              setStreetAddress(e.target.value);
                              if (errors.streetAddress) setErrors((prev) => ({ ...prev, streetAddress: '' }));
                            }}
                            className={`w-full rounded-xl bg-cream-50/70 border pl-9 pr-3 py-2 text-xs text-forest-900 placeholder:text-forest-700/40 focus:outline-none focus:bg-white transition-all ${
                              errors.streetAddress ? 'border-red-400 ring-1 ring-red-400' : 'border-cream-300 focus:border-leaf-500'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Landmark & Pincode Grid */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-forest-900 mb-1">
                            Landmark (Optional)
                          </label>
                          <div className="relative">
                            <Navigation className="absolute left-3 top-2.5 h-3.5 w-3.5 text-leaf-600/70" />
                            <input
                              type="text"
                              placeholder="e.g. Near Apollo Pharmacy"
                              value={landmark}
                              onChange={(e) => setLandmark(e.target.value)}
                              className="w-full rounded-xl bg-cream-50/70 border border-cream-300 pl-9 pr-3 py-2 text-xs text-forest-900 placeholder:text-forest-700/40 focus:outline-none focus:bg-white focus:border-leaf-500 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-forest-900 mb-1 flex items-center justify-between">
                            <span>Pincode <span className="text-red-500">*</span></span>
                            {errors.pincode && <span className="text-[10px] text-red-500 font-medium">6 digits</span>}
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-leaf-600/70" />
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="e.g. 500081"
                              value={pincode}
                              onChange={(e) => {
                                setPincode(e.target.value.replace(/[^0-9]/g, ''));
                                if (errors.pincode) setErrors((prev) => ({ ...prev, pincode: '' }));
                              }}
                              className={`w-full rounded-xl bg-cream-50/70 border pl-9 pr-3 py-2 text-xs text-forest-900 placeholder:text-forest-700/40 focus:outline-none focus:bg-white transition-all ${
                                errors.pincode ? 'border-red-400 ring-1 ring-red-400' : 'border-cream-300 focus:border-leaf-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Customer Name & WhatsApp Phone Grid */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-forest-900 mb-1 flex items-center justify-between">
                            <span>Your Name <span className="text-red-500">*</span></span>
                            {errors.customerName && <span className="text-[10px] text-red-500 font-medium">Required</span>}
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-leaf-600/70" />
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={customerName}
                              onChange={(e) => {
                                setCustomerName(e.target.value);
                                if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
                              }}
                              className={`w-full rounded-xl bg-cream-50/70 border pl-9 pr-3 py-2 text-xs text-forest-900 placeholder:text-forest-700/40 focus:outline-none focus:bg-white transition-all ${
                                errors.customerName ? 'border-red-400 ring-1 ring-red-400' : 'border-cream-300 focus:border-leaf-500'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-forest-900 mb-1 flex items-center justify-between">
                            <span>WhatsApp Phone <span className="text-red-500">*</span></span>
                            {errors.customerPhone && <span className="text-[10px] text-red-500 font-medium">10 digits</span>}
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-leaf-600/70" />
                            <input
                              type="tel"
                              maxLength={13}
                              placeholder="10-digit number"
                              value={customerPhone}
                              onChange={(e) => {
                                setCustomerPhone(e.target.value);
                                if (errors.customerPhone) setErrors((prev) => ({ ...prev, customerPhone: '' }));
                              }}
                              className={`w-full rounded-xl bg-cream-50/70 border pl-9 pr-3 py-2 text-xs text-forest-900 placeholder:text-forest-700/40 focus:outline-none focus:bg-white transition-all ${
                                errors.customerPhone ? 'border-red-400 ring-1 ring-red-400' : 'border-cream-300 focus:border-leaf-500'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Special Delivery Instructions */}
                      <div>
                        <label className="block text-[11px] font-semibold text-forest-900 mb-1">
                          Delivery Instructions (Optional)
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-leaf-600/70" />
                          <input
                            type="text"
                            placeholder="e.g. Please deliver before 8:30 AM, or leave at gate"
                            value={customerNote}
                            onChange={(e) => setCustomerNote(e.target.value)}
                            className="w-full rounded-xl bg-cream-50/70 border border-cream-300 pl-9 pr-3 py-2 text-xs text-forest-900 placeholder:text-forest-700/40 focus:outline-none focus:bg-white focus:border-leaf-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-cream-200 bg-white shadow-lg space-y-3 shrink-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-forest-700 font-medium">Estimated Harvest Total:</span>
                  <span className="font-serif text-2xl font-bold text-forest-900">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-4 font-semibold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-75"
                >
                  <Send className="h-4 w-4" />
                  <span>{isPlacingOrder ? 'Recording Order...' : 'Place Order on WhatsApp'}</span>
                </button>

                <p className="text-center text-[11px] text-forest-700/70">
                  Transfers order & delivery address to Vikrshi WhatsApp ({settings.whatsappDisplay})
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

