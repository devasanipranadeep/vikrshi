import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ShopContent } from '@/components/shop/ShopContent';

export const metadata: Metadata = {
  title: 'Organic Shop | Fresh Vegetables & Fruits in Hyderabad',
  description:
    'Browse daily dawn-harvested organic vegetables, crisp leafy greens, and pesticide-free fruits from Vikrshi Suppliers Pvt Ltd. Order on WhatsApp for prompt delivery.',
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-leaf-500 border-t-transparent" />
          <p className="mt-4 text-xs font-semibold text-forest-700">Loading fresh harvest catalog...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
