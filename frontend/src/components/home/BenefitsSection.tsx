'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  Sparkles,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Truck,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      id: 'fresh-products',
      icon: Sparkles,
      title: '100% Fresh Products',
      headline: 'Freshness begins at the farm.',
      paragraphs: [
        'At Vikrshi, our goal is to bring vegetables and fruits to customers while they are at their best. We prioritize products that is fresh, seasonal, naturally vibrant, and suitable for everyday family consumption.',
        'Rather than treating products as a commodity that simply needs to be transported and stored, we focus on reducing unnecessary handling and avoiding unnecessarily long supply chains wherever practical.',
      ],
      pointsHeader: 'What this means for customers:',
      points: [
        'Freshly sourced vegetables and fruits.',
        'Seasonal products whenever available.',
        'Better appearance, texture and natural taste.',
        'Reduced time between sourcing and customer.',
        'Products selected with everyday household needs in mind.',
      ],
      highlightLabel: 'Our promise:',
      highlightText: "From the farm's freshness to your family's table.",
      color: 'bg-emerald-500/10 text-emerald-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      image: '/benefits/image-1.jpg',
      alt: 'Fresh organic harvest in wooden crate with farmers harvesting in the farm field',
    },
    {
      id: 'responsibly-sourced',
      icon: Sprout,
      title: 'Responsibly Sourced',
      headline: 'We care about where your food comes from.',
      paragraphs: [
        'Responsible sourcing means building relationships with farmers and suppliers who value quality, responsible cultivation and consistent product standards.',
        'Vikrshi aims to create a more transparent connection between farmers and consumers, helping customers understand that their food comes from real agricultural communities—not simply an anonymous supply chain.',
      ],
      pointsHeader: 'Our approach focuses on:',
      points: [
        'Building relationships with local and regional farmers.',
        'Supporting responsible agricultural practices.',
        'Understanding the source of products.',
        'Creating fairer opportunities for farmers.',
        'Reducing unnecessary layers between farmers and consumers.',
      ],
      highlightLabel: 'Our belief:',
      highlightText: 'When farmers are valued, communities become stronger.',
      color: 'bg-leaf-500/10 text-leaf-600',
      badgeColor: 'bg-leaf-50 text-leaf-700 border-leaf-200',
      image: '/benefits/image-2.jpg',
      alt: 'Dedicated farmer caring for crops in lush green natural fields',
    },
    {
      id: 'farm-fresh-quality',
      icon: ShieldCheck,
      title: 'Farm Fresh Quality',
      headline: 'Quality you can see, feel and taste.',
      paragraphs: [
        "Freshness alone isn't enough. Products also needs to meet a consistent standard before it reaches the customer.",
      ],
      pointsHeader: 'Our team focuses on factors such as:',
      points: [
        'Fresh appearance.',
        'Firmness and natural texture.',
        'Appropriate ripeness.',
        'Cleanliness.',
        'Overall condition.',
        'Suitability for consumption.',
        'Removal of visibly damaged or unsuitable products.',
      ],
      extraNote: 'We want every basket to represent the Vikrshi standard of quality.',
      highlightLabel: 'Our promise:',
      highlightText: 'Fresh from the farm. Carefully handled. Ready for your kitchen.',
      color: 'bg-amber-500/10 text-amber-700',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      image: '/benefits/image-3.jpg',
      alt: 'Fresh crisp vegetables and produce with morning dew drops in a wicker basket',
    },
    {
      id: 'carefully-selected',
      icon: CheckCircle2,
      title: 'Carefully Selected',
      headline: 'Not everything harvested belongs in your basket.',
      paragraphs: [
        'Selection is an important part of the Vikrshi process.',
        'Product is checked before it reaches customers so that visibly damaged, excessively bruised, spoiled or unsuitable items can be separated.',
        'This additional attention helps us maintain consistency across every order.',
      ],
      pointsHeader: 'Our selection process focuses on:',
      points: [
        'Source – Where the product comes from.',
        'Freshness – How fresh it is.',
        'Appearance – Visible quality and condition.',
        'Ripeness – Appropriate stage for consumption.',
        'Handling – Careful packing and movement.',
        'Final check – Quality before delivery.',
      ],
      highlightLabel: 'Our philosophy:',
      highlightText: "We don't just sell produce. We select what we would want for our own families.",
      color: 'bg-teal-500/10 text-teal-600',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      image: '/benefits/image-4.jpg',
      alt: 'Hand sorting and inspection of freshly picked organic tomatoes and vegetables',
    },
    {
      id: 'direct-whatsapp',
      icon: MessageCircle,
      title: 'Direct WhatsApp Ordering',
      headline: 'Fresh products should be easy to order.',
      paragraphs: [
        'Vikrshi keeps ordering simple through direct WhatsApp communication.',
        'Instead of navigating complicated ordering systems, customers can communicate directly with the Vikrshi team, check available products, place their requirements and receive order-related updates.',
      ],
      pointsHeader: 'How it works:',
      steps: [
        { step: '1. Browse', text: 'See the available vegetables, fruits and seasonal products.' },
        { step: '2. Message', text: 'Send your requirements directly through WhatsApp.' },
        { step: '3. Confirm', text: 'Confirm quantities and order details with the Vikrshi team.' },
        { step: '4. Prepare', text: 'The required produce is selected and prepared.' },
        { step: '5. Deliver', text: 'Your order reaches you through our local delivery network.' },
      ],
      extraNote:
        'This direct communication also helps us understand customer preferences and continuously improve our service.',
      highlightLabel: 'Direct Channel:',
      highlightText: 'Your requirement → Our team → Fresh produce → Your community',
      color: 'bg-[#25D366]/10 text-[#25D366]',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      image: '/benefits/image-5.jpg',
      alt: 'WhatsApp ordering on smartphone showing morning fresh harvest photos',
    },
    {
      id: 'local-delivery',
      icon: Truck,
      title: 'Local Farm Delivery',
      headline: 'Shorter journeys. Fresher possibilities.',
      paragraphs: [
        'Vikrshi focuses on connecting agricultural produce with local communities and families.',
        'Local delivery helps us create a closer relationship between the source of the product and the people who consume it.',
      ],
      pointsHeader: 'For customers, this means:',
      points: [
        'Convenient doorstep delivery.',
        'Fresh produce delivered locally.',
        'Less effort for regular household shopping.',
        'Better connection with local agricultural supply.',
        'Community-focused service.',
      ],
      extraNote:
        'For farmers, stronger local demand can create an additional route to reach consumers.',
      highlightLabel: 'Farm-to-Kitchen Route:',
      highlightText: 'Farm → Vikrshi → Local Community → Your Kitchen',
      color: 'bg-indigo-500/10 text-indigo-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      image: '/benefits/image-6.jpg',
      alt: 'Local morning fresh delivery rider on scooter with crate of fresh greens',
    },
  ];

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + benefits.length) % benefits.length));
  }, [benefits.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % benefits.length));
  }, [benefits.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (selectedIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, handleClose, handlePrev, handleNext]);

  const selectedBenefit = selectedIndex !== null ? benefits[selectedIndex] : null;

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

        {/* Benefits Cards Grid - 3 columns on desktop, 2 on tablet and mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.button
                type="button"
                key={benefit.title}
                onClick={() => setSelectedIndex(index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="group relative text-left rounded-2xl sm:rounded-3xl bg-white/95 sm:bg-white p-4 sm:p-6 lg:p-7 border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.16)] hover:border-leaf-300/80 transition-all duration-300 flex flex-col items-start justify-between cursor-pointer backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-leaf-500 focus:ring-offset-2 overflow-hidden"
                style={{
                  boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
                }}
                aria-label={`Open photo and details for ${benefit.title}`}
              >
                {/* Subtle corner hover highlight */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-leaf-100/40 via-transparent to-transparent rounded-tr-2xl sm:rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Icon */}
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover:scale-110 mb-3 sm:mb-4 ${benefit.color}`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                {/* Title */}
                <div className="w-full">
                  <h3 className="font-serif text-base sm:text-lg md:text-xl font-bold text-forest-950 group-hover:text-leaf-700 transition-colors leading-snug">
                    {benefit.title}
                  </h3>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal for Card Images */}
      {mounted && typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {selectedBenefit && selectedIndex !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    aria-hidden="true"
                  />

                  {/* Modal Dialog */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 15 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/40 z-10 flex flex-col max-h-[92vh] my-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-label={selectedBenefit.title}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header Bar */}
                    <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-forest-100/80 bg-forest-50/50 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-leaf-700 bg-leaf-100/80 px-2.5 py-0.5 rounded-full">
                          {selectedIndex + 1} / {benefits.length}
                        </span>
                        <span className="text-xs text-forest-700 font-medium">
                          The Vikrshi Standard
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full p-1.5 text-forest-600 hover:text-forest-950 hover:bg-forest-100/80 transition-colors focus:outline-none focus:ring-2 focus:ring-leaf-500"
                        aria-label="Close modal"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Scrollable / Responsive body */}
                    <div className="overflow-y-auto p-5 sm:p-7 md:p-8">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
                        {/* Left Side: Image + Nav Arrows + Indicators */}
                        <div className="md:col-span-5 flex flex-col items-center">
                          <div className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-[4/5] rounded-2xl overflow-hidden bg-forest-900/5 shadow-md border border-forest-100">
                            <Image
                              src={selectedBenefit.image}
                              alt={selectedBenefit.alt}
                              fill
                              sizes="(max-width: 768px) 100vw, 420px"
                              className="object-cover object-center"
                              priority
                            />

                            {/* Left / Right floating arrows on image */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrev();
                              }}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-xs text-forest-900 shadow-lg flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-leaf-500"
                              aria-label="Previous standard"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                              }}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-xs text-forest-900 shadow-lg flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-leaf-500"
                              aria-label="Next standard"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Thumbnail dots selector */}
                          <div className="mt-4 flex items-center justify-center gap-2">
                            {benefits.map((b, idx) => (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => setSelectedIndex(idx)}
                                className={`transition-all duration-200 rounded-full ${
                                  idx === selectedIndex
                                    ? 'w-7 h-2 bg-leaf-600'
                                    : 'w-2 h-2 bg-forest-200 hover:bg-forest-400'
                                }`}
                                aria-label={`Jump to ${b.title}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Right Side: Text Details */}
                        <div className="md:col-span-7 flex flex-col text-left space-y-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selectedBenefit.color} mt-0.5`}
                            >
                              {React.createElement(selectedBenefit.icon, {
                                className: 'h-5 w-5',
                              })}
                            </div>
                            <div>
                              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950 leading-tight">
                                {selectedBenefit.title}
                              </h3>
                              <p className="text-sm sm:text-base font-semibold text-leaf-700 italic mt-0.5">
                                {selectedBenefit.headline}
                              </p>
                            </div>
                          </div>

                          {/* Paragraphs */}
                          <div className="space-y-2.5 text-sm sm:text-[15px] text-forest-800 leading-relaxed font-normal">
                            {selectedBenefit.paragraphs.map((para, pIdx) => (
                              <p key={pIdx}>{para}</p>
                            ))}
                          </div>

                          {/* Points Section (if any) */}
                          {selectedBenefit.points && selectedBenefit.points.length > 0 && (
                            <div className="pt-2">
                              {selectedBenefit.pointsHeader && (
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-forest-900 mb-2">
                                  {selectedBenefit.pointsHeader}
                                </h4>
                              )}
                              <ul className="space-y-1.5">
                                {selectedBenefit.points.map((pt, ptIdx) => (
                                  <li key={ptIdx} className="flex items-start gap-2 text-xs sm:text-sm text-forest-800 leading-relaxed">
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700 mt-0.5">
                                      <Check className="h-3 w-3" />
                                    </span>
                                    <span>{pt}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Steps Section (e.g. for WhatsApp) */}
                          {selectedBenefit.steps && selectedBenefit.steps.length > 0 && (
                            <div className="pt-2">
                              {selectedBenefit.pointsHeader && (
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-forest-900 mb-2">
                                  {selectedBenefit.pointsHeader}
                                </h4>
                              )}
                              <div className="grid grid-cols-1 gap-2">
                                {selectedBenefit.steps.map((st, stIdx) => (
                                  <div
                                    key={stIdx}
                                    className="flex items-start gap-2.5 bg-forest-50/70 p-2.5 sm:p-3 rounded-xl border border-forest-100/80"
                                  >
                                    <span className="text-xs sm:text-sm font-bold text-leaf-700 shrink-0">
                                      {st.step}
                                    </span>
                                    <span className="text-xs sm:text-sm text-forest-800">
                                      {st.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Extra Note (if any) */}
                          {selectedBenefit.extraNote && (
                            <p className="text-xs sm:text-sm text-forest-700 font-medium italic pt-1">
                              {selectedBenefit.extraNote}
                            </p>
                          )}

                          {/* Highlight / Promise / Philosophy Box */}
                          <div className="mt-3 p-3.5 sm:p-4 rounded-xl bg-leaf-50/80 border border-leaf-200/80">
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-leaf-800">
                              {selectedBenefit.highlightLabel}
                            </span>
                            <span className="block text-sm sm:text-base font-semibold text-forest-950 mt-0.5">
                              {selectedBenefit.highlightText}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer Controls */}
                    <div className="px-5 sm:px-6 py-3 border-t border-forest-100 flex items-center justify-between bg-white">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-forest-700 hover:text-forest-950 px-3 py-1.5 rounded-lg hover:bg-forest-50 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>

                      <button
                        type="button"
                        onClick={handleClose}
                        className="text-xs sm:text-sm font-semibold text-forest-600 hover:text-forest-900 px-3 py-1.5"
                      >
                        Close
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-forest-700 hover:text-forest-950 px-3 py-1.5 rounded-lg hover:bg-forest-50 transition-colors"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )
        : null}

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

