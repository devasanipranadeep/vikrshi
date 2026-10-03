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
      icon: Sun,
      title: 'Dawn Harvest',
      desc: 'Harvested fresh from fields at 5:00 AM before sunrise to lock in natural vitamins and moisture.',
      time: '5:00 AM',
    },
    {
      step: '02',
      icon: ShieldCheck,
      title: 'Quality Grading',
      desc: 'Cold-water rinsed and manually graded for peak nutritional maturity and zero blemishes.',
      time: '7:30 AM',
    },
    {
      step: '03',
      icon: PackageCheck,
      title: 'Eco Packaging',
      desc: 'Wrapped in breathable compostable paper and jute to allow fresh leaves to breathe naturally.',
      time: '10:00 AM',
    },
    {
      step: '04',
      icon: Sprout,
      title: 'Central Hub Intake',
      desc: 'Temperature-stabilized transit directly to our central Hyderabad sorting depot.',
      time: '1:00 PM',
    },
    {
      step: '05',
      icon: Truck,
      title: 'Direct Dispatch',
      desc: 'Evening express routes deployed directly across Hyderabad residential hubs.',
      time: '3:30 PM',
    },
    {
      step: '06',
      icon: HeartHandshake,
      title: 'At Your Doorstep',
      desc: 'Delivered to your kitchen at 5:00 PM the exact same day, ready for wholesome family meals.',
      time: '5:00 PM',
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
            The 12-Hour Farm to Home Journey
          </h2>
        </div>

        {/* Timeline Grid - 2 per line on mobile, 6 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 relative">
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
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative z-10 flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-forest-900/80 backdrop-blur-md border border-leaf-500/20 hover:border-leaf-400/50 shadow-lg transition-all duration-300 justify-center"
              >
                {/* Icon bubble with Step Number */}
                <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-leaf-500/20 text-leaf-300 border border-leaf-400/30 shadow-md group-hover:scale-110 group-hover:bg-leaf-500 group-hover:text-white transition-all duration-300 mb-2.5 sm:mb-3">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-harvest-gold text-[9px] sm:text-[10px] font-bold text-forest-950">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-serif text-xs sm:text-base lg:text-lg font-bold text-white group-hover:text-leaf-300 transition-colors leading-snug">
                  {item.title}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
