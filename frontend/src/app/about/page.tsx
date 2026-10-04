import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';

export const metadata: Metadata = {
  title: 'About Our Organic Farming Mission | Vikrshi Suppliers Pvt Ltd',
  description:
    'Learn how Vikrshi Suppliers Pvt Ltd bridges Telangana smallholder organic farmers with Hyderabad households through direct dawn harvest delivery and living-soil stewardship.',
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 bg-cream-50">
      {/* Hero Banner */}
      <section className="relative py-20 bg-forest-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=80"
            alt="Organic farming green fields"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-leaf-300 bg-leaf-500/20 px-3.5 py-1 rounded-full inline-block mb-4 border border-leaf-400/30">
            About Vikrshi Suppliers Pvt Ltd
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            We believe fresh food should travel the shortest possible journey.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-cream-200/85 leading-relaxed">
            Bridging organic agro-clusters in Telangana with conscious urban families in Hyderabad through dawn harvesting, living-soil stewardship, and zero synthetic chemicals.
          </p>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-600 bg-leaf-100/70 px-3 py-1 rounded-full inline-block">
              Leadership
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
              Director’s Message
            </h2>
            <p className="text-sm sm:text-base text-forest-700/85 leading-relaxed">
              At <strong>Vikrshi Suppliers Pvt Ltd</strong>, we believe that good food begins with good farming and strong relationships.
            </p>
            <p className="text-sm sm:text-base text-forest-700/85 leading-relaxed">
              Our journey is built on a simple vision — to bring fresh, responsibly sourced, farm-quality products closer to families while creating fair and transparent connections with the farmers who grow them.
            </p>
            <p className="text-sm sm:text-base text-forest-700/85 leading-relaxed">
              We understand that every product carries a story — from the soil it comes from, to the hands that cultivate it, and finally to the family that brings it to their table. That is why we are committed to careful sourcing, maintaining consistent quality, and keeping the journey from farm to home as direct and transparent as possible.
            </p>
            <p className="text-sm sm:text-base text-forest-700/85 leading-relaxed">
              As we grow, our promise remains unchanged: quality without compromise, relationships built on trust, and freshness delivered with care.
            </p>
            <p className="text-sm sm:text-base text-forest-700/85 leading-relaxed">
              We are grateful to our farmers, customers, partners, and team members who are part of this journey. Together, we hope to build a more responsible, transparent, and sustainable food supply network for the future.
            </p>
            <div className="pt-2 border-t border-cream-200/80">
              <p className="text-xs sm:text-sm text-forest-700/85 italic">
                With gratitude and commitment,
              </p>
              <p className="font-serif text-lg sm:text-xl font-bold text-forest-950 mt-1">
                𝓜𝓪𝓷𝓪𝓼𝓪 𝓚𝓸𝓷𝓰𝓪𝓵𝓪
              </p>
              <p className="text-xs text-forest-700/80 font-medium mt-0.5">
                Director<br />Vikrshi Suppliers Pvt Ltd
              </p>
            </div>

            <div className="pt-2 flex items-center gap-6">
              <div>
                <span className="font-serif text-3xl font-bold text-forest-950 block">45+</span>
                <span className="text-xs text-forest-700/70">Partner Organic Farms</span>
              </div>
              <div className="h-10 w-px bg-cream-300" />
              <div>
                <span className="font-serif text-3xl font-bold text-leaf-600 block">100%</span>
                <span className="text-xs text-forest-700/70">Chemical-Free Certified</span>
              </div>
              <div className="h-10 w-px bg-cream-300" />
              <div>
                <span className="font-serif text-3xl font-bold text-harvest-coral block">0 days</span>
                <span className="text-xs text-forest-700/70">Warehouse Storage</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80"
              alt="Farmers in organic farm"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <ProcessTimeline />
    </div>
  );
}
