'use client';

import React from 'react';
import {
  Sparkles,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Truck,
  HeartHandshake,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function BenefitsSection() {
  const benefits = [
    {
      icon: Sparkles,
      title: '100% Fresh Products',
      description: 'Harvested before sunrise and packed chilled to lock in cellular moisture, natural vitamins, and farm fragrance.',
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      icon: Sprout,
      title: 'Responsibly Sourced',
      description: 'Grown exclusively with cow-based Jeevamrutham, organic green manure, and zero synthetic chemical pesticides.',
      color: 'bg-leaf-500/10 text-leaf-600',
    },
    {
      icon: ShieldCheck,
      title: 'Farm Fresh Quality',
      description: 'No wax coatings, artificial ripening gases, or preservative sprays. Real products that look, smell, and taste genuine.',
      color: 'bg-amber-500/10 text-amber-700',
    },
    {
      icon: CheckCircle2,
      title: 'Carefully Selected',
      description: 'Every bunch of greens and crate of vegetables undergoes gentle manual grading to eliminate bruised or wilted items.',
      color: 'bg-teal-500/10 text-teal-600',
    },
    {
      icon: MessageCircle,
      title: 'Direct WhatsApp Ordering',
      description: 'Skip rigid checkout forms. Order through a friendly WhatsApp conversation directly with our farm dispatch team.',
      color: 'bg-[#25D366]/10 text-[#25D366]',
    },
    {
      icon: Truck,
      title: 'Local Farm Delivery',
      description: 'Dedicated temperature-managed morning routes across Hyderabad ensure products arrive in pristine condition.',
      color: 'bg-indigo-500/10 text-indigo-600',
    },
  ];

  return (
    <section className="py-20 bg-cream-50 relative overflow-hidden -mt-2 z-10">
      {/* Decorative leaf motifs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-leaf-600 bg-leaf-100/60 px-3 py-1 rounded-full inline-block mb-3">
            The Vikrshi Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950 tracking-tight">
            Cultivated with Care, Delivered with Integrity
          </h2>
          <p className="mt-3 text-sm sm:text-base text-forest-700/80 leading-relaxed">
            We believe healthy food begins with fertile living soil and ends with transparent relationships between farmers and conscious families.
          </p>
        </div>

        {/* Benefits Cards Grid - 2 per line on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl bg-white p-4 sm:p-5 md:p-6 border border-cream-200 shadow-2xs hover:shadow-lg hover:border-leaf-300 transition-all duration-300 flex flex-col items-start justify-center"
              >
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 ${benefit.color}`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="font-serif text-sm sm:text-base md:text-lg font-bold text-forest-950 group-hover:text-leaf-600 transition-colors leading-snug">
                  {benefit.title}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
