import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { initialGalleryItems } from '@/constants/mockData';
import { GalleryItem } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory gallery store initialized with authentic Vikrshi farm & facility photography
let galleryStore: GalleryItem[] = [...initialGalleryItems];

const gallerySchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  caption: z.string().optional().default(''),
  category: z.enum(['farms', 'harvest', 'coldchain', 'community']).default('farms'),
  locationTag: z.string().optional().default('Telangana, India'),
  imageUrl: z.string().min(1, 'Image URL or file is required'),
  imagePath: z.string().optional().nullable(),
  date: z.string().optional().default('Recent'),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(1),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const includeInactive = searchParams.get('all') === 'true';

    let items = galleryStore;
    if (!includeInactive) {
      items = items.filter((item) => item.isActive !== false);
    }

    if (category && category !== 'all') {
      items = items.filter((item) => item.category === category);
    }

    return NextResponse.json(
      {
        success: true,
        data: items,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = gallerySchema.parse(body);

    const newItem: GalleryItem = {
      id: `gallery-${Date.now()}`,
      title: validated.title,
      caption: validated.caption || '',
      category: validated.category,
      locationTag: validated.locationTag || 'Telangana, India',
      imageUrl: validated.imageUrl,
      imagePath: validated.imagePath || undefined,
      date: validated.date || 'Today',
      featured: validated.featured ?? false,
      sortOrder: validated.sortOrder ?? (galleryStore.length + 1),
      isActive: validated.isActive !== false,
      createdAt: new Date().toISOString(),
    };

    galleryStore.unshift(newItem);

    return NextResponse.json(
      {
        success: true,
        message: 'Photo added to gallery successfully!',
        data: newItem,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add photo' },
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
        { success: false, message: 'Photo ID is required for update' },
        { status: 400 }
      );
    }

    const index = galleryStore.findIndex((item) => item.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Photo not found in gallery' },
        { status: 404 }
      );
    }

    galleryStore[index] = {
      ...galleryStore[index],
      ...updates,
    };

    return NextResponse.json({
      success: true,
      message: 'Photo updated successfully',
      data: galleryStore[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update photo' },
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
        { success: false, message: 'Photo ID is required' },
        { status: 400 }
      );
    }

    const initialLength = galleryStore.length;
    galleryStore = galleryStore.filter((item) => item.id !== id);

    if (galleryStore.length === initialLength) {
      return NextResponse.json(
        { success: false, message: 'Photo not found in gallery' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Photo deleted from gallery successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
