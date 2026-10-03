'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useSettings } from '@/context/SettingsContext';
import { buildSingleProductWhatsAppUrl, buildOutOfStockInquiryWhatsAppUrl } from '@/utils/whatsapp';
import { formatCurrency } from '@/utils/formatters';
import { MessageCircle, ShoppingBag, Plus, Minus, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { selectedLocation } = useLocation();
  const { settings } = useSettings();

  const isOutOfStock = !product.inStock || product.availabilityStatus === 'out_of_stock';

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = buildSingleProductWhatsAppUrl({
      phone: settings.whatsappNumber,
      companyName: settings.companyName,
      product,
      quantity,
      location: selectedLocation,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInquiryWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = buildOutOfStockInquiryWhatsAppUrl({
      phone: settings.whatsappNumber,
      companyName: settings.companyName,
      product,
      location: selectedLocation,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white border shadow-xs hover:shadow-xl transition-all duration-300 ${
        isOutOfStock
          ? 'border-cream-300/80 bg-cream-50/30'
          : 'border-cream-200/90 hover:border-leaf-300'
      }`}
    >
      {/* Top Badges */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 items-start">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-bold shadow-md backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Out of Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold shadow-xs backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            In Stock
          </span>
        )}
        {product.isOrganic && (
          <span className="inline-flex items-center gap-1 rounded-full bg-forest-900/85 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-semibold text-leaf-200 backdrop-blur-md shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-leaf-400" />
            100% Organic
          </span>
        )}
        {product.isSeasonal && (
          <span className="inline-flex items-center gap-1 rounded-full bg-harvest-amber/90 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-semibold text-forest-950 backdrop-blur-md shadow-xs">
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            Seasonal
          </span>
        )}
      </div>

      {/* Image Container with Link */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-4/3 w-full overflow-hidden bg-cream-100"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ease-out group-hover:scale-108 ${
            isOutOfStock ? 'grayscale-40 opacity-80' : ''
          }`}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-forest-950/25 backdrop-blur-[1px] flex items-center justify-center">
            <span className="rounded-full bg-forest-950/90 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider px-2.5 sm:px-3.5 py-1 sm:py-1.5 border border-white/20 shadow-lg">
              Temporarily Sold Out
            </span>
          </div>
        )}

        {/* Harvest tag overlay at bottom of image */}
        {product.harvestDate && (
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 z-10 rounded-md bg-white/90 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-forest-800 backdrop-blur-sm shadow-2xs truncate max-w-[90%]">
            🌱 {product.harvestDate}
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-4 md:p-5 justify-between">
        <div>
          {/* Category & Origin */}
          <div className="flex items-center justify-between text-xs text-forest-700/70 mb-1 sm:mb-1.5">
            <span className="font-semibold text-leaf-600 uppercase tracking-wider text-[10px] sm:text-[11px] truncate">
              {product.categoryName}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-[11px] truncate max-w-[130px]">
              <MapPin className="h-3 w-3 text-leaf-500 shrink-0" />
              {(product.originLocation || 'Chevella, Telangana').split(',')[0]}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="group-hover:text-leaf-600 transition-colors block">
            <h3 className="font-serif text-xs sm:text-base md:text-lg font-bold text-forest-950 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Quantity & Actions */}
        <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-cream-200/80">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div>
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="font-serif text-sm sm:text-xl font-bold text-forest-950">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[10px] sm:text-xs text-forest-700/50 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] text-forest-700/70 block truncate max-w-[90px] sm:max-w-none">
                per {product.unit}
              </span>
            </div>

            {/* Micro Quantity Stepper */}
            <div className={`flex items-center rounded-lg border border-cream-300 bg-cream-50 p-0.5 ${isOutOfStock ? 'opacity-40 pointer-events-none' : ''}`}>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded text-forest-800 hover:bg-cream-200"
                aria-label="Decrease quantity"
              >
                <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </button>
              <span className="w-4 sm:w-6 text-center text-[11px] sm:text-xs font-bold text-forest-900">
                {quantity}
              </span>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded text-forest-800 hover:bg-cream-200"
                aria-label="Increase quantity"
              >
                <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </button>
            </div>
          </div>

          {/* Buttons: WhatsApp Order + Add to Order List */}
          {isOutOfStock ? (
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              <div className="col-span-3 flex items-center justify-center rounded-lg sm:rounded-xl bg-cream-200 text-forest-700/60 py-2 sm:py-2.5 px-1 sm:px-3 text-[10px] sm:text-xs font-bold border border-cream-300 select-none">
                Sold Out
              </div>
              <button
                type="button"
                onClick={handleInquiryWhatsApp}
                className="col-span-2 flex items-center justify-center gap-1 rounded-lg sm:rounded-xl bg-leaf-100 hover:bg-leaf-200 text-leaf-800 py-2 sm:py-2.5 px-1 sm:px-2 text-[10px] sm:text-xs font-semibold transition-colors cursor-pointer border border-leaf-300/60"
                title="Inquire restock timing on WhatsApp"
              >
                <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-leaf-700 shrink-0" />
                <span className="truncate">Inquire</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="col-span-4 flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white py-2 sm:py-2.5 px-1.5 sm:px-3 text-[10px] sm:text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                title="Order on WhatsApp"
              >
                <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">
                  <span className="sm:hidden">WhatsApp</span>
                  <span className="hidden sm:inline">Order on WhatsApp</span>
                </span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className="col-span-1 flex items-center justify-center rounded-lg sm:rounded-xl bg-forest-900 hover:bg-forest-800 text-white transition-colors cursor-pointer py-2 sm:py-2.5"
                title="Add to order list"
                aria-label={`Add ${product.name} to order list`}
              >
                <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
