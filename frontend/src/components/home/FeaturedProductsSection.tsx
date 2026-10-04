'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { productService } from '@/services/productService';
import { initialProducts } from '@/constants/mockData';
import { ProductCard } from '@/components/products/ProductCard';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';
import { ArrowRight, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await productService.getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (e) {
        if (isMounted) setProducts(initialProducts);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();

    const unsubscribe = subscribeToStoreUpdates(() => {
      load();
    }, ['products', 'all']);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const filterTabs = [
    { label: 'All Harvest', value: 'all' },
    { label: 'Vegetables', value: 'vegetables' },
    { label: 'Fruits', value: 'fruits' },
    { label: 'Leafy Greens', value: 'greens' },
    { label: 'Seasonal Specials', value: 'seasonal' },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.category === selectedFilter;
  });

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-cream-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-600 bg-leaf-100/60 px-3 py-1 rounded-full inline-block mb-3">
              Today&apos;s Morning Harvest
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
              Featured Farm Products
            </h2>
            <p className="mt-2 text-sm text-forest-700/80 max-w-xl">
              Freshly plucked from certified Telangana farms. Select your favorites to build your WhatsApp order list or order directly with a single click.
            </p>
          </div>

          {/* View shop link */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors self-start md:self-auto group"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {filterTabs.map((tab) => {
            const active = selectedFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedFilter(tab.value)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'bg-white text-forest-800 border border-cream-200 hover:border-leaf-300 hover:bg-leaf-50/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid with AnimatePresence */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-cream-200/60 animate-pulse border border-cream-200"
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.slice(0, 8).map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
