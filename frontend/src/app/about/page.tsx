import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ProcessTimeline } from '@/components/home/ProcessTimeline';
import {
  Sprout,
  ShieldCheck,
  Heart,
  Users,
  Sun,
  Truck,
  Leaf,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

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
              Why We Started
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
              Transforming the Plate by Honoring the Soil
            </h2>
            <p className="text-sm sm:text-base text-forest-700/85 leading-relaxed">
              Every day across India, vegetables travel through three to four middle-tier wholesale markets, spending up to a week in refrigerated trucks before reaching city households. By then, their vital enzymes have deteriorated, cellular water has transpired, and natural fragrances have vanished.
            </p>
            <p className="text-sm sm:text-base text-forest-700/85 leading-relaxed">
              <strong>Vikrshi Suppliers Pvt Ltd</strong> was founded with an uncompromising purpose: dismantle this industrial food delay. We partnered with smallholder farmers within a 100km perimeter of Hyderabad to establish a 12-hour harvest-to-kitchen model.
            </p>
            <p className="text-sm sm:text-base text-forest-700/85 leading-relaxed">
              When our farmers pluck tomatoes, dig up carrots, or harvest baby spinach at dawn, those exact crops are on their way to your home for same-day delivery by 5:00 PM.
            </p>

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

      {/* Farm Visit CTA */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-forest-900 p-8 sm:p-12 text-white shadow-xl text-center max-w-3xl mx-auto border border-leaf-500/20">
          <Sprout className="h-12 w-12 text-leaf-300 mx-auto mb-4" />
          <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
            Experience Our Chevella Farms in Person
          </h3>
          <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed mb-6 max-w-xl mx-auto">
            We host weekend morning farm walks for Hyderabad families and school groups. Walk through the tomato groves, see how Jeevamrutham is brewed, and let your children harvest their own carrots.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="w-full sm:w-auto rounded-xl bg-leaf-500 hover:bg-leaf-600 text-white px-6 py-3 text-xs sm:text-sm font-semibold shadow-md transition-colors"
            >
              Book a Weekend Farm Visit
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto rounded-xl bg-white text-forest-950 px-6 py-3 text-xs sm:text-sm font-semibold hover:bg-cream-100 transition-colors"
            >
              Order Produce on WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
