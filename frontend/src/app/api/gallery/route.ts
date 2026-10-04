import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { instagramPosts } from '@/constants/mockData';
import { SocialPost } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory gallery store (persists during server runtime, initialized with farm journey stories)
let galleryPostsStore: SocialPost[] = instagramPosts.map((post) => ({
  id: post.id,
  imageUrl: post.imageUrl,
  caption: post.caption,
  likes: post.likes,
  date: post.date,
  postUrl: 'https://instagram.com/vikrshi',
  isActive: true,
  createdAt: new Date().toISOString(),
}));

const postSchema = z.object({
  imageUrl: z.string().min(1, 'Image URL or file is required'),
  imagePath: z.string().optional().nullable(),
  caption: z.string().min(3, 'Caption must be at least 3 characters'),
  likes: z.number().int().min(0).default(0),
  date: z.string().min(1).default('Today'),
  postUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    return NextResponse.json(
      {
        success: true,
        data: galleryPostsStore.filter((p) => p.isActive !== false),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch gallery posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = postSchema.parse(body);

    const newPost: SocialPost = {
      id: `gallery-${Date.now()}`,
      imageUrl: validated.imageUrl,
      imagePath: validated.imagePath || undefined,
      caption: validated.caption,
      likes: validated.likes ?? 0,
      date: validated.date || 'Today',
      postUrl: validated.postUrl || 'https://instagram.com/vikrshi',
      isActive: validated.isActive !== false,
      createdAt: new Date().toISOString(),
    };

    galleryPostsStore.unshift(newPost);

    return NextResponse.json(
      {
        success: true,
        message: 'Gallery photo published successfully!',
        data: newPost,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create gallery post' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Post ID is required for update' },
        { status: 400 }
      );
    }

    const index = galleryPostsStore.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    galleryPostsStore[index] = {
      ...galleryPostsStore[index],
      ...updates,
    };

    return NextResponse.json({
      success: true,
      message: 'Gallery post updated successfully',
      data: galleryPostsStore[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update gallery post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Post ID is required' },
        { status: 400 }
      );
    }

    const initialLength = galleryPostsStore.length;
    galleryPostsStore = galleryPostsStore.filter((p) => p.id !== id);

    if (galleryPostsStore.length === initialLength) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery post removed successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete gallery post' },
      { status: 500 }
    );
  }
}
