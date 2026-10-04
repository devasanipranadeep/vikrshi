'use client';

import React, { useRef } from 'react';
import {
  Sparkles,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Truck,
  HeartHandshake,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll progress: from when section enters until it leaves the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Initially white (0), fades in smoothly (1), stays visible, then fades out to white as next section approaches (0)
  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.45, 0.75, 0.95],
    [0, 1, 1, 0]
  );
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

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
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white pt-24 sm:pt-32 md:pt-40 pb-28 sm:pb-36 md:pb-44 z-10"
    >
      {/* Farm Background Image — Initially white (opacity: 0), becomes visible as scrolling starts */}
      <motion.div
        className="absolute -top-[10%] -bottom-[10%] left-0 right-0 w-full h-[120%] pointer-events-none z-0 will-change-transform bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundPosition: 'center 42%',
          opacity: backgroundOpacity,
          y: backgroundY,
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-leaf-700 bg-white/90 backdrop-blur-xs px-3.5 py-1 rounded-full inline-block mb-3 border border-leaf-200/60 shadow-xs">
            The Vikrshi Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-950 tracking-tight drop-shadow-xs">
            Cultivated with Care, Delivered with Integrity
          </h2>
          <p className="mt-3 text-sm sm:text-base text-forest-800/90 font-medium leading-relaxed max-w-xl mx-auto">
            We believe healthy food begins with fertile living soil and ends with transparent relationships between farmers and conscious families.
          </p>
        </div>

        {/* Benefits Cards Grid - 3 columns on desktop, 2 on tablet, responsive on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
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
                className="group relative rounded-2xl sm:rounded-3xl bg-white/95 sm:bg-white p-5 sm:p-6 lg:p-7 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.15)] hover:border-leaf-300/60 transition-all duration-300 flex flex-col items-start justify-center backdrop-blur-xs"
                style={{
                  boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
                }}
              >
                <div
                  className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110 ${benefit.color}`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold text-forest-950 group-hover:text-leaf-600 transition-colors leading-snug">
                  {benefit.title}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Large Organic Wavy Section Transition to Our Root Story */}
      <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-20">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative block w-full h-16 sm:h-24 md:h-28 lg:h-36 align-bottom"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,45 C 160,20 280,24 450,32 C 650,42 780,50 900,48 C 1050,45 1180,20 1260,28 C 1330,35 1380,75 1440,99 L 1440,121 L 0,121 Z"
            fill="#F0F3EC"
          />
        </svg>
      </div>
    </section>
  );
}
