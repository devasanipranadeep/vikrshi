import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { SocialPost } from '@/types';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BUCKET_NAME = 'vikrshi-media';
const METADATA_FILE = 'gallery-metadata.json';

async function loadPersistedGalleryPosts(): Promise<SocialPost[]> {
  try {
    const adminClient = createAdminClient();
    const { data: fileData, error } = await adminClient.storage
      .from(BUCKET_NAME)
      .download(METADATA_FILE);

    if (!error && fileData) {
      const text = await fileData.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read gallery-metadata.json from Supabase:', err);
  }

  // Check if there are admin-uploaded images in vikrshi-media/gallery/
  try {
    const adminClient = createAdminClient();
    const { data: files } = await adminClient.storage.from(BUCKET_NAME).list('gallery');
    const validImageFiles = (files || []).filter(
      (f) => !f.name.startsWith('.') && (f.name.endsWith('.jpg') || f.name.endsWith('.jpeg') || f.name.endsWith('.png') || f.name.endsWith('.webp'))
    );

    if (validImageFiles.length > 0) {
      const generated: SocialPost[] = validImageFiles.map((file, i) => {
        const { data: publicUrlData } = adminClient.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`gallery/${file.name}`);
        return {
          id: `gallery-file-${file.id || i}`,
          imageUrl: publicUrlData.publicUrl,
          imagePath: `gallery/${file.name}`,
          caption: 'Fresh harvest from our partner farms. 🌿',
          likes: 0,
          date: 'Today',
          postUrl: undefined,
          isActive: true,
          createdAt: file.created_at || new Date().toISOString(),
        };
      });

      await savePersistedGalleryPosts(generated);
      return generated;
    }
  } catch (err) {
    console.warn('Could not list gallery images from Supabase:', err);
  }

  // Zero mock data: return empty array if no images have been uploaded by admin
  return [];
}

async function savePersistedGalleryPosts(posts: SocialPost[]): Promise<boolean> {
  try {
    const adminClient = createAdminClient();
    const buffer = Buffer.from(JSON.stringify(posts, null, 2));
    const { error } = await adminClient.storage.from(BUCKET_NAME).upload(METADATA_FILE, buffer, {
      contentType: 'application/json',
      upsert: true,
    });
    if (error) {
      console.error('Failed to save gallery metadata:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error saving gallery metadata:', err);
    return false;
  }
}

const postSchema = z.object({
  imageUrl: z.string().min(1, 'Image URL or file is required'),
  imagePath: z.string().optional().nullable(),
  caption: z.string().min(1, 'Caption must not be empty'),
  likes: z.number().int().min(0).default(0),
  date: z.string().min(1).default('Today'),
  postUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    const posts = await loadPersistedGalleryPosts();
    return NextResponse.json(
      {
        success: true,
        data: posts.filter((p) => p.isActive !== false),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch gallery posts', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = postSchema.parse(body);

    const posts = await loadPersistedGalleryPosts();

    const newPost: SocialPost = {
      id: `gallery-${Date.now()}`,
      imageUrl: validated.imageUrl,
      imagePath: validated.imagePath || undefined,
      caption: validated.caption,
      likes: validated.likes ?? 0,
      date: validated.date || 'Today',
      postUrl: validated.postUrl || undefined,
      isActive: validated.isActive !== false,
      createdAt: new Date().toISOString(),
    };

    posts.unshift(newPost);
    await savePersistedGalleryPosts(posts);

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

    const posts = await loadPersistedGalleryPosts();
    const index = posts.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    posts[index] = {
      ...posts[index],
      ...updates,
    };

    await savePersistedGalleryPosts(posts);

    return NextResponse.json({
      success: true,
      message: 'Gallery post updated successfully',
      data: posts[index],
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

    let posts = await loadPersistedGalleryPosts();
    const initialLength = posts.length;
    posts = posts.filter((p) => p.id !== id);

    if (posts.length === initialLength) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    await savePersistedGalleryPosts(posts);

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
