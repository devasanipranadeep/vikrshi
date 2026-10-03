'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { Category } from '@/types';
import { categoryService } from '@/services/categoryService';
import { initialCategories } from '@/constants/mockData';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  useEffect(() => {
    const loadCategories = () => {
      categoryService.getCategories().then((data) => {
        if (data && data.length > 0) setCategories(data);
      });
    };

    loadCategories();

    // Auto-refresh when categories OR products are modified by the admin
    const unsubscribe = subscribeToStoreUpdates(() => {
      loadCategories();
    }, ['categories', 'products', 'all']);

    return () => {
      unsubscribe();
    };
  }, []);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-cream-100/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-600 bg-leaf-100/60 px-3 py-1 rounded-full inline-block mb-3">
              Explore Our Harvest
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
              Fresh Organic Categories
            </h2>
            <p className="mt-2 text-sm text-forest-700/80 max-w-xl">
              From dawn-harvested leafy greens to naturally ripened orchard fruits, each harvest is gathered at peak nutritional maturity.
            </p>
          </div>

          <NextLink
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-600 hover:text-leaf-700 group transition-colors self-start md:self-auto"
          >
            <span>View All Products</span>
            <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
          </NextLink>
        </div>

        {/* Categories Grid - 2 per line on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-cream-200/90 shadow-2xs hover:shadow-xl transition-all duration-300"
            >
              {/* Category Image with Zoom Effect */}
              <NextLink
                href={`/shop?category=${category.slug}`}
                className="relative aspect-4/3 w-full overflow-hidden bg-cream-200 block"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />

                {/* Badge Count */}
                <span className="absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full bg-white/90 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-forest-900 shadow-xs backdrop-blur-sm">
                  {category.itemCount === 1
                    ? '1 variety'
                    : category.itemCount && category.itemCount > 1
                    ? `${category.itemCount} varieties`
                    : '0 varieties'}
                </span>

                {/* Overlay Name on Image */}
                <div className="absolute bottom-2 left-2.5 right-2.5 sm:bottom-3 sm:left-4 sm:right-4">
                  <h3 className="font-serif text-sm sm:text-base md:text-xl font-bold text-white tracking-wide drop-shadow-xs leading-tight">
                    {category.name}
                  </h3>
                </div>
              </NextLink>

              {/* Explore CTA Link */}
              <div className="p-2.5 sm:p-3.5 bg-white border-t border-cream-100/80 flex items-center">
                <NextLink
                  href={`/shop?category=${category.slug}`}
                  className="inline-flex items-center justify-between w-full text-[11px] sm:text-xs font-bold text-leaf-600 group-hover:text-forest-900 transition-colors"
                >
                  <span className="truncate">Explore {category.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 transform transition-transform group-hover:translate-x-1 shrink-0 ml-1" />
                </NextLink>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
