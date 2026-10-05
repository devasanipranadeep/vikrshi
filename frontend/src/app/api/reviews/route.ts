import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { CustomerReview } from '@/types';
import {
  loadPersistedReviews,
  insertPersistedReview,
  deletePersistedReview,
  upvotePersistedReview,
} from '@/services/reviewsServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const reviewSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  location: z.string().trim().min(2, 'Please provide your locality/city in Telangana').max(60),
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120),
  comment: z.string().trim().min(10, 'Please write at least 10 characters describing your experience').max(1000),
  productName: z.string().trim().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase().trim();
    const ratingParam = searchParams.get('rating');
    const locationParam = searchParams.get('location')?.toLowerCase().trim();
    const sort = searchParams.get('sort') || 'newest';

    const allReviews = await loadPersistedReviews();
    let filtered = [...allReviews];

    // Filter by rating
    if (ratingParam && ratingParam !== 'all') {
      const targetRating = parseInt(ratingParam, 10);
      if (!isNaN(targetRating)) {
        filtered = filtered.filter((r) => r.rating === targetRating);
      }
    }

    // Filter by location
    if (locationParam && locationParam !== 'all') {
      filtered = filtered.filter((r) => r.location.toLowerCase().includes(locationParam));
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.title.toLowerCase().includes(search) ||
          r.comment.toLowerCase().includes(search) ||
          r.location.toLowerCase().includes(search) ||
          (r.productName && r.productName.toLowerCase().includes(search))
      );
    }

    // Sorting
    if (sort === 'highest') {
      filtered.sort((a, b) => b.rating - a.rating || (b.helpfulCount || 0) - (a.helpfulCount || 0));
    } else if (sort === 'lowest') {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (sort === 'most_helpful') {
      filtered.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    } else {
      // Default: newest first (by id descending or order)
      filtered.sort((a, b) => {
        const timeA = a.id.startsWith('rev-') && !isNaN(Number(a.id.replace('rev-', ''))) 
          ? Number(a.id.replace('rev-', '')) 
          : 0;
        const timeB = b.id.startsWith('rev-') && !isNaN(Number(b.id.replace('rev-', ''))) 
          ? Number(b.id.replace('rev-', '')) 
          : 0;
        return timeB - timeA;
      });
    }

    // Statistics based on all reviews
    const totalCount = allReviews.length;
    const sumRatings = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = totalCount > 0 ? Number((sumRatings / totalCount).toFixed(1)) : 5.0;

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach((r) => {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[rounded] = (distribution[rounded] || 0) + 1;
    });

    const recommendedCount = allReviews.filter((r) => r.rating >= 4).length;
    const recommendationRate = totalCount > 0 ? Math.round((recommendedCount / totalCount) * 100) : 98;

    return NextResponse.json({
      success: true,
      data: {
        reviews: filtered,
        stats: {
          totalReviews: totalCount,
          averageRating,
          recommendationRate,
          distribution,
        },
      },
    });
  } catch (error) {
    console.error('GET /api/reviews error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve customer reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, location, rating, title, comment, productName } = result.data;

    const savedReview = await insertPersistedReview({
      name,
      location,
      rating,
      title,
      comment,
      productName,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for sharing your experience! Your review is now saved.',
        data: savedReview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/reviews error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process review submission' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId } = body;

    if (!reviewId) {
      return NextResponse.json(
        { success: false, message: 'Review ID is required' },
        { status: 400 }
      );
    }

    const newHelpfulCount = await upvotePersistedReview(reviewId);

    return NextResponse.json({
      success: true,
      helpfulCount: newHelpfulCount,
    });
  } catch (error) {
    console.error('PATCH /api/reviews error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upvote review' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Review ID is required' }, { status: 400 });
    }

    await deletePersistedReview(id);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully from database',
    });
  } catch (error) {
    console.error('DELETE /api/reviews error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete review' },
      { status: 500 }
    );
  }
}

