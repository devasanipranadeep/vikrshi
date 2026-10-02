'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useSettings } from '@/context/SettingsContext';
import { buildMultiProductWhatsAppUrl } from '@/utils/whatsapp';
import { formatCurrency } from '@/utils/formatters';
import { X, Plus, Minus, Trash2, ShoppingBag, MapPin, Send, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, clearCart, totalItems, totalAmount } =
    useCart();
  const { selectedLocation, openLocationSelector } = useLocation();
  const { settings } = useSettings();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0 || isPlacingOrder) return;

    setIsPlacingOrder(true);
    const toastId = toast.loading('Verifying harvest availability & preparing WhatsApp dispatch...');

    try {
      // 1. Secure Server-side Inquiry Creation (validates prices and location in Supabase)
      const { createWhatsAppOrderAction } = await import('@/actions/orders');
      const res = await createWhatsAppOrderAction({
        locationId: selectedLocation,
        customerName: customerName || undefined,
        customerPhone: customerPhone || undefined,
        customerNote: customerNote || undefined,
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

      toast.success('Order inquiry recorded! Redirecting to WhatsApp...', { id: toastId });

      let targetUrl = res.whatsappUrl;
      if (!targetUrl) {
        targetUrl = buildMultiProductWhatsAppUrl({
          phone: settings.whatsappNumber,
          companyName: settings.companyName,
          items,
          location: selectedLocation,
          customerNote,
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
        customerNote,
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

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="w-screen max-w-md bg-cream-50 shadow-2xl flex flex-col border-l border-leaf-100"
          >
            {/* Header */}
            <div className="p-5 border-b border-cream-200 bg-white/80 backdrop-blur-md">
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
                  className="rounded-full p-2 text-forest-900/60 hover:bg-cream-200 hover:text-forest-900 transition-colors"
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
                  className="text-leaf-500 hover:text-leaf-600 font-medium underline"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Content / Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
                    Browse Fresh Produce
                  </Link>
                </div>
              ) : (
                <>
                  {/* WhatsApp Direct Order Notice */}
                  <div className="rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-3 text-xs text-emerald-900 flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p>
                      <strong>Direct Farm Ordering:</strong> We don&apos;t charge payment here. Your selected list is formatted and dispatched directly to our WhatsApp farm manager for instant order confirmation.
                    </p>
                  </div>

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
                                className="text-forest-700/40 hover:text-red-500 transition-colors p-1 shrink-0"
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
                                className="p-1 hover:bg-cream-200 text-forest-900 transition-colors rounded-l-lg"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-forest-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 hover:bg-cream-200 text-forest-900 transition-colors rounded-r-lg"
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

                  {/* Customer Order Note */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-forest-900 mb-1">
                      Delivery instructions or special requests (optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Please deliver before 8 AM, or slightly unripe bananas..."
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      className="w-full rounded-xl bg-white border border-cream-300 px-3 py-2 text-xs text-forest-900 placeholder:text-forest-700/50 focus:border-leaf-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={clearCart}
                      className="text-xs text-forest-700/60 hover:text-red-500 transition-colors underline"
                    >
                      Clear order list
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-cream-200 bg-white shadow-lg space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-forest-700 font-medium">Estimated Harvest Total:</span>
                  <span className="font-serif text-2xl font-bold text-forest-900">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                {/* Customer name and phone for accurate WhatsApp order attribution */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name (optional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3 py-2 text-xs text-forest-900 placeholder:text-forest-700/50 focus:border-leaf-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone (optional)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-xl bg-cream-50 border border-cream-200 px-3 py-2 text-xs text-forest-900 placeholder:text-forest-700/50 focus:border-leaf-500 focus:outline-none"
                  />
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
                  Transfers directly to Vikrshi WhatsApp ({settings.whatsappDisplay})
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
