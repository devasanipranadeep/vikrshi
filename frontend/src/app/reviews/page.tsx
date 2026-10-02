import { Metadata } from 'next';
import Link from 'next/link';
import { initialReviews } from '@/constants/mockData';
import { ReviewsContent } from '@/components/reviews/ReviewsContent';
import { getReviewsPageSchema } from '@/utils/seo';
import { ChevronRight, Sparkles, MessageSquareHeart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Customer Reviews & Real Farm Feedback | Vikrshi Suppliers Pvt Ltd',
  description:
    'Read genuine, verified reviews from families across Hyderabad, Secunderabad, and Telangana who receive Vikrshi daily morning harvest of organic vegetables and fruits.',
  openGraph: {
    title: 'Customer Reviews — Vikrshi Suppliers Pvt Ltd',
    description:
      'Discover what 280+ Hyderabad households say about our zero-pesticide, dawn-harvested organic produce.',
    url: 'https://vikrshi.com/reviews',
    siteName: 'Vikrshi Suppliers Pvt Ltd',
    type: 'website',
  },
};

export default function ReviewsPage() {
  // Pre-calculate initial stats for server render
  const total = initialReviews.length;
  const sum = initialReviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = total > 0 ? Number((sum / total).toFixed(1)) : 5.0;
  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  initialReviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    distribution[star] = (distribution[star] || 0) + 1;
  });
  const recRate = Math.round((initialReviews.filter((r) => r.rating >= 4).length / total) * 100);

  const initialStats = {
    totalReviews: total,
    averageRating: avg,
    recommendationRate: recRate,
    distribution,
  };

  const schemaJson = getReviewsPageSchema(initialReviews, avg, 280);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <main className="min-h-screen bg-cream-50 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-forest-600 mb-6">
            <Link href="/" className="hover:text-forest-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-forest-400" />
            <span className="font-semibold text-forest-900">Customer Reviews</span>
          </nav>

          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf-100 border border-leaf-200 text-leaf-800 text-xs font-semibold uppercase tracking-wider">
              <MessageSquareHeart className="w-4 h-4 text-leaf-700" />
              Community Voices
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-950 tracking-tight">
              What Hyderabad Families Say About Vikrshi
            </h1>

            <p className="text-forest-700 text-sm sm:text-base leading-relaxed">
              Every morning, our dawn-harvested crates arrive at dining tables across Jubilee Hills, Gachibowli, Kondapur, and beyond. Here is unfiltered feedback from our community.
            </p>
          </div>

          {/* Main Content Component */}
          <ReviewsContent
            initialReviews={initialReviews}
            initialStats={initialStats}
          />
        </div>
      </main>
    </>
  );
}
