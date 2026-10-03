import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Vikrshi Suppliers Pvt Ltd',
  description: 'Terms of Service governing product orders and deliveries from Vikrshi Suppliers Pvt Ltd.',
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20 bg-cream-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-2xs space-y-6 text-forest-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-500/10 text-leaf-500">
              <Scale className="h-6 w-6" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-forest-950">
              Terms of Service
            </h1>
          </div>
          <p className="text-xs text-forest-700/60">
            Last Updated: October 2026 • Vikrshi Suppliers Pvt Ltd
          </p>

          <div className="space-y-4 text-xs sm:text-sm text-forest-800 leading-relaxed pt-4 border-t border-cream-100">
            <h3 className="font-serif text-lg font-bold text-forest-950">1. Product Nature & Natural Variation</h3>
            <p>
              All vegetables, leafy greens, and fruits supplied by Vikrshi Suppliers Pvt Ltd are grown using natural, organic methods without cosmetic chemical sprays or synthetic sizing hormones. Consequently, individual items may exhibit natural variations in shape, size, and seasonal pigmentation.
            </p>

            <h3 className="font-serif text-lg font-bold text-forest-950">2. Order Confirmation via WhatsApp</h3>
            <p>
              Constructing an order list on this website generates a structured request for dispatch. Final item confirmation, delivery batch timing, and payment settlement are concluded directly with our customer desk via WhatsApp.
            </p>

            <h3 className="font-serif text-lg font-bold text-forest-950">3. Freshness Guarantee & Replacement</h3>
            <p>
              We stand firmly behind the quality of every dawn harvest. If any item arrives damaged or unsatisfactory during delivery handover, notify our team via WhatsApp with a photo within 12 hours of delivery for an immediate credit or replacement in your subsequent harvest crate.
            </p>

            <h3 className="font-serif text-lg font-bold text-forest-950">4. Delivery Hubs & Timing</h3>
            <p>
              Morning delivery runs occur between 6:30 AM and 9:30 AM across authorized Hyderabad zones. External weather or traffic conditions may occasionally necessitate minor schedule shifts, which are communicated via WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
