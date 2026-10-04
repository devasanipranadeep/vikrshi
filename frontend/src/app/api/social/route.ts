import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { instagramPosts } from '@/constants/mockData';
import { SocialPost } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory social store (persists during server runtime, initialized with farm journey stories)
let socialPostsStore: SocialPost[] = instagramPosts.map((post) => ({
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
        data: socialPostsStore.filter((p) => p.isActive !== false),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch social posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = postSchema.parse(body);

    const newPost: SocialPost = {
      id: `social-${Date.now()}`,
      imageUrl: validated.imageUrl,
      imagePath: validated.imagePath || undefined,
      caption: validated.caption,
      likes: validated.likes ?? 0,
      date: validated.date || 'Today',
      postUrl: validated.postUrl || 'https://instagram.com/vikrshi',
      isActive: validated.isActive !== false,
      createdAt: new Date().toISOString(),
    };

    socialPostsStore.unshift(newPost);

    return NextResponse.json(
      {
        success: true,
        message: 'Farm story published successfully!',
        data: newPost,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create social post' },
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
        { success: false, message: 'Story ID is required for update' },
        { status: 400 }
      );
    }

    const index = socialPostsStore.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Story not found' },
        { status: 404 }
      );
    }

    socialPostsStore[index] = {
      ...socialPostsStore[index],
      ...updates,
    };

    return NextResponse.json({
      success: true,
      message: 'Story updated successfully',
      data: socialPostsStore[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update story' },
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
        { success: false, message: 'Story ID is required' },
        { status: 400 }
      );
    }

    const initialLength = socialPostsStore.length;
    socialPostsStore = socialPostsStore.filter((p) => p.id !== id);

    if (socialPostsStore.length === initialLength) {
      return NextResponse.json(
        { success: false, message: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Story removed successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete story' },
      { status: 500 }
    );
  }
}
