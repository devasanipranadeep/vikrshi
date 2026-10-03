'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sprout, Heart, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function StorySection() {
  const pillars = [
    {
      title: 'Uncompromised Living Soil',
      desc: 'Enriched with indigenous Jeevamrutham bio-cultures instead of fossil-fuel synthetic fertilizers.',
    },
    {
      title: 'Direct Farmer Partnerships',
      desc: 'Fair, guaranteed pricing 30% above mandi spot-rates for smallholder farmers across Telangana.',
    },
    {
      title: 'Zero Chemical Wax or Gas',
      desc: 'Products ripen under natural Telangana sun, without artificial ethylene gassing or cosmetic polishing.',
    },
    {
      title: 'Transparent Traceability',
      desc: 'Every batch traces back to specific agro-clusters in Chevella, Vikarabad, and Mahabubnagar.',
    },
  ];

  return (
    <section className="py-24 bg-cream-100/70 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Imagery Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1000&q=80"
                alt="Farmer harvesting organic greens at dawn"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Overlapping Secondary Image */}
            <div className="absolute -bottom-8 -right-6 hidden sm:block w-3/5 aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
                alt="Fresh organic vegetable harvest basket"
                fill
                sizes="(max-width: 1024px) 60vw, 30vw"
                className="object-cover"
              />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -top-6 -left-4 sm:left-4 rounded-2xl bg-forest-900 p-4 text-white shadow-xl border border-leaf-400/30 backdrop-blur-md">
              <span className="font-serif text-3xl font-bold text-leaf-300 block">
                100%
              </span>
              <span className="text-[11px] font-medium text-cream-200/80 uppercase tracking-wider block">
                Direct Farm-to-Home
              </span>
            </div>
          </motion.div>

          {/* Text Storytelling */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-leaf-600 bg-leaf-100/60 px-3 py-1 rounded-full inline-block mb-3">
                Our Root Story
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-950 tracking-tight leading-tight">
                Fresh food should travel the shortest possible journey.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-forest-700/85 leading-relaxed">
              At <strong>Vikrshi Suppliers Pvt Ltd</strong>, we saw how conventional grocery supply chains strip food of its aroma, cellular nutrients, and life force by holding vegetables in refrigerated storage for days.
            </p>

            <p className="text-sm sm:text-base text-forest-700/85 leading-relaxed">
              We replaced middle-mandi middlemen with direct farm covenants across Telangana. When you order from Vikrshi, your products were rooted in living soil just hours before arriving at your doorstep in Hyderabad.
            </p>

            {/* Pillars list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {pillars.map((item) => (
                <div key={item.title} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-leaf-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-forest-950">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-forest-700/70 mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold px-6 py-3.5 text-xs sm:text-sm shadow-md transition-all group"
              >
                <span>Read Full Story & Mission</span>
                <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
