'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { productService } from '@/services/products';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';
import { useCart } from '@/context/CartContext';
import { useLocation } from '@/context/LocationContext';
import { useSettings } from '@/context/SettingsContext';
import { buildSingleProductWhatsAppUrl, buildOutOfStockInquiryWhatsAppUrl } from '@/utils/whatsapp';
import { formatCurrency } from '@/utils/formatters';
import { ProductCard } from '@/components/products/ProductCard';
import {
  MessageCircle,
  ShoppingBag,
  Plus,
  Minus,
  MapPin,
  Sparkles,
  ShieldCheck,
  Clock,
  Leaf,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowLeft,
  Share2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({ product: initialProduct, relatedProducts }: ProductDetailViewProps) {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [selectedImage, setSelectedImage] = useState(initialProduct.image);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { selectedLocation } = useLocation();
  const { settings } = useSettings();

  React.useEffect(() => {
    setProduct(initialProduct);
    setSelectedImage(initialProduct.image);
  }, [initialProduct]);

  React.useEffect(() => {
    const refreshProduct = async () => {
      try {
        const fresh = await productService.getProductBySlug(initialProduct.slug);
        if (fresh) {
          setProduct(fresh);
        }
      } catch {}
    };

    const unsubscribe = subscribeToStoreUpdates(() => {
      refreshProduct();
    }, ['products', 'all']);

    return () => {
      unsubscribe();
    };
  }, [initialProduct.slug]);

  const isOutOfStock = !product.inStock || product.availabilityStatus === 'out_of_stock';
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleWhatsAppOrder = () => {
    const url = buildSingleProductWhatsAppUrl({
      phone: settings.whatsappNumber,
      companyName: settings.companyName,
      product,
      quantity,
      location: selectedLocation,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInquiryWhatsApp = () => {
    const url = buildOutOfStockInquiryWhatsAppUrl({
      phone: settings.whatsappNumber,
      companyName: settings.companyName,
      product,
      location: selectedLocation,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error(`${product.name} is currently out of stock`);
      return;
    }
    addToCart(product, quantity);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: `${product.name} | Vikrshi Organic Farms`,
        text: product.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="pt-24 pb-20 bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between py-4 mb-4 text-xs text-forest-700/70">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Harvest</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1 text-forest-700 hover:text-forest-950 p-1 rounded-lg hover:bg-cream-200 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* Main Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-2xs mb-16">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <motion.div
              layoutId={`img-${product.id}`}
              className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-cream-100 shadow-inner border border-cream-200"
            >
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-all duration-300"
              />

              {product.isOrganic && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-forest-900/85 px-3 py-1 text-xs font-semibold text-leaf-200 backdrop-blur-md">
                  <Leaf className="h-3.5 w-3.5 text-leaf-400" />
                  <span>100% Certified Organic</span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail switcher if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-20 w-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === img
                        ? 'border-leaf-500 shadow-md ring-2 ring-leaf-500/20'
                        : 'border-cream-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Origin & Harvest info banner */}
            <div className="rounded-2xl bg-cream-100/70 p-4 border border-cream-200 text-xs text-forest-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-leaf-500" />
                  Origin Cluster:
                </span>
                <span className="text-forest-900 font-medium">{product.originLocation}</span>
              </div>
              {product.harvestDate && (
                <div className="flex items-center justify-between pt-1 border-t border-cream-200">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-leaf-500" />
                    Harvest Timeline:
                  </span>
                  <span className="text-leaf-600 font-semibold">{product.harvestDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Info & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-leaf-100/80 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-leaf-600">
                  {product.categoryName}
                </span>
                {isOutOfStock ? (
                  <span className="rounded-full bg-red-100 border border-red-200 px-3 py-0.5 text-xs font-bold text-red-700 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                    Sold Out
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100/80 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    In Stock
                  </span>
                )}
                {product.isSeasonal && (
                  <span className="rounded-full bg-harvest-amber/20 px-3 py-0.5 text-xs font-bold text-harvest-coral">
                    Seasonal Harvest
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-forest-700/50 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                <span className="text-sm text-forest-700/80">/ {product.unit}</span>
              </div>

              {/* Delivery hub indicator */}
              {isOutOfStock ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs border border-amber-200/80 text-amber-900">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Currently <strong>Temporarily Sold Out</strong> for <strong>{selectedLocation}</strong>. Next morning harvest batch is being prepared.</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-xl bg-leaf-50 px-3.5 py-2 text-xs border border-leaf-200/70 text-forest-900">
                  <Clock className="h-4 w-4 text-leaf-500 shrink-0" />
                  <span>Available for <strong>Same-Day Morning Delivery</strong> in <strong>{selectedLocation}</strong></span>
                </div>
              )}

              {/* Description */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-forest-700/70 mb-1.5">
                  Product Overview
                </h3>
                <p className="text-sm text-forest-700/85 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Nutritional Highlights */}
              {product.nutritionalHighlights && product.nutritionalHighlights.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forest-700/70 mb-2">
                    Key Health Benefits
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.nutritionalHighlights.map((benefit, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-leaf-50 border border-leaf-100 px-2.5 py-1 text-xs font-medium text-leaf-600"
                      >
                        <CheckCircle2 className="h-3 w-3 text-leaf-500" />
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Farming & Soil Method */}
              {product.farmingMethod && (
                <div className="rounded-xl bg-cream-50 p-3.5 border border-cream-200 text-xs">
                  <span className="font-bold text-forest-950 block mb-1">
                    🌱 Soil & Cultivation Method:
                  </span>
                  <span className="text-forest-700/80">{product.farmingMethod}</span>
                </div>
              )}
            </div>

            {/* Actions: Quantity + WhatsApp + Add to Order */}
            <div className="pt-6 border-t border-cream-200 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-700/70">
                  Quantity:
                </span>
                <div className={`flex items-center rounded-xl border border-cream-300 bg-cream-50 p-1 ${isOutOfStock ? 'opacity-40 pointer-events-none' : ''}`}>
                  <button
                    disabled={isOutOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-cream-200 text-forest-900 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-forest-950">
                    {quantity}
                  </span>
                  <button
                    disabled={isOutOfStock}
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-cream-200 text-forest-900 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {!isOutOfStock && (
                  <span className="text-xs text-forest-700/60">
                    Total: <strong className="text-forest-950 font-bold">{formatCurrency(product.price * quantity)}</strong>
                  </span>
                )}
              </div>

              {isOutOfStock ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleInquiryWhatsApp}
                    className="flex items-center justify-center gap-2 rounded-xl bg-leaf-600 hover:bg-leaf-500 text-white py-4 px-6 text-sm font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Inquire Next Harvest on WhatsApp</span>
                  </button>

                  <button
                    disabled
                    className="flex items-center justify-center gap-2 rounded-xl bg-cream-200 text-forest-700/60 py-4 px-6 text-sm font-semibold border border-cream-300 cursor-not-allowed select-none"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Temporarily Out of Stock</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-6 text-sm font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Order on WhatsApp</span>
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white py-4 px-6 text-sm font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Add to Order List</span>
                  </button>
                </div>
              )}

              <p className="text-[11px] text-center text-forest-700/60">
                Direct farm harvest • Pay upon morning delivery confirmation on WhatsApp
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-leaf-600">
                  Complementary Harvest
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                  You Might Also Like
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-leaf-600 hover:underline"
              >
                View all products
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
