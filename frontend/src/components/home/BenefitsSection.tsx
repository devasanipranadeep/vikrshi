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
      title: '100% Fresh Produce',
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
      description: 'No wax coatings, artificial ripening gases, or preservative sprays. Real produce that looks, smells, and tastes genuine.',
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
      description: 'Dedicated temperature-managed morning routes across Hyderabad ensure produce arrives in pristine condition.',
      color: 'bg-indigo-500/10 text-indigo-600',
    },
  ];

  return (
    <section className="py-20 bg-cream-50 relative overflow-hidden -mt-1 z-10">
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

        {/* Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative rounded-2xl bg-white p-7 border border-cream-200 shadow-2xs hover:shadow-xl hover:border-leaf-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110 ${benefit.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-forest-950 mb-2 group-hover:text-leaf-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-forest-700/80 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-cream-100 flex items-center text-xs font-semibold text-leaf-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Farm Certified</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
