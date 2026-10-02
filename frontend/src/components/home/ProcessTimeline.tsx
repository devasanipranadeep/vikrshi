'use client';

import React from 'react';
import {
  Sprout,
  Sun,
  ShieldCheck,
  PackageCheck,
  Truck,
  HeartHandshake,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function ProcessTimeline() {
  const steps = [
    {
      step: '01',
      icon: Sprout,
      title: 'Regenerative Farm',
      desc: 'Nourished by indigenous Jeevamrutham bio-cultures, vermicompost, and clean groundwater.',
      time: 'Day 0',
    },
    {
      step: '02',
      icon: Sun,
      title: 'Dawn Harvest',
      desc: 'Hand-picked at 4:30 AM before peak solar transpiration to preserve crisp hydration.',
      time: '4:30 AM',
    },
    {
      step: '03',
      icon: ShieldCheck,
      title: 'Quality Selection',
      desc: 'Rinsed in cold spring water and hand-graded for peak ripeness and zero blemishes.',
      time: '6:00 AM',
    },
    {
      step: '04',
      icon: PackageCheck,
      title: 'Eco Packaging',
      desc: 'Wrapped in breathable compostable paper and jute to allow leaves to breathe naturally.',
      time: '7:30 AM',
    },
    {
      step: '05',
      icon: Truck,
      title: 'Direct Dispatch',
      desc: 'Temperature-stabilized morning routes deployed straight from Shamshabad hub.',
      time: '8:30 AM',
    },
    {
      step: '06',
      icon: HeartHandshake,
      title: 'At Your Doorstep',
      desc: 'Delivered to your kitchen table ready to enrich healthy meals for your family.',
      time: 'Morning Run',
    },
  ];

  return (
    <section className="py-24 bg-forest-950 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-leaf-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-leaf-300 bg-leaf-500/20 px-3 py-1 rounded-full inline-block mb-3 border border-leaf-400/30">
            Transparent Supply Cycle
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            The 8-Hour Farm to Home Journey
          </h2>
          <p className="mt-3 text-sm sm:text-base text-cream-200/80 leading-relaxed">
            Every step is engineered to safeguard biological freshness without commercial chemical delay.
          </p>
        </div>

        {/* Desktop / Tablet Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-14 left-10 right-10 h-0.5 bg-gradient-to-r from-leaf-500/30 via-leaf-400 to-leaf-500/30 -z-0" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative z-10 flex flex-col items-center text-center p-5 rounded-2xl bg-forest-900/80 backdrop-blur-md border border-leaf-500/20 hover:border-leaf-400/50 shadow-lg transition-all duration-300"
              >
                {/* Step indicator pill */}
                <span className="text-[10px] font-bold uppercase tracking-widest text-leaf-300 mb-2">
                  {item.time}
                </span>

                {/* Icon bubble */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-500/20 text-leaf-300 border border-leaf-400/30 shadow-md group-hover:scale-110 group-hover:bg-leaf-500 group-hover:text-white transition-all duration-300 mb-4">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-harvest-gold text-[10px] font-bold text-forest-950">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-leaf-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-cream-200/70 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
