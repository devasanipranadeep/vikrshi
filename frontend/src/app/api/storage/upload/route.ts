import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

function getSanitizedFileName(originalName: string): string {
  const parts = originalName.split('.');
  const ext = (parts.pop() || 'jpg').toLowerCase();
  const cleanBase = parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .slice(0, 30);
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${cleanBase || 'gallery'}-${timestamp}-${randomSuffix}.${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const requestedFolder = (formData.get('folder') as string) || 'gallery';
    const targetBucket = (formData.get('bucket') as string) || 'vikrshi-media';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `Invalid file type (${file.type}). Allowed: JPEG, PNG, WEBP.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max limit is 10MB.` },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const fileName = getSanitizedFileName(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to requested folder in vikrshi-media bucket (e.g. gallery/fileName)
    const filePath = requestedFolder ? `${requestedFolder}/${fileName}` : fileName;

    const uploadRes = await adminClient.storage
      .from(targetBucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600',
      });

    if (uploadRes.error) {
      console.error('Supabase storage upload error:', uploadRes.error);
      return NextResponse.json(
        { success: false, message: `Storage upload failed: ${uploadRes.error.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = adminClient.storage
      .from(targetBucket)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      imageUrl: publicUrlData.publicUrl,
      imagePath: filePath,
      bucket: targetBucket,
      message: 'Image uploaded to Supabase storage successfully',
    });
  } catch (error: any) {
    console.error('Storage route error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error processing file upload' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('imagePath');
    const bucket = searchParams.get('bucket') || 'vikrshi-media';

    if (!imagePath) {
      return NextResponse.json(
        { success: false, message: 'imagePath is required' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Try deleting from specified bucket
    let { error } = await adminClient.storage.from(bucket).remove([imagePath]);

    // Fallback: If deleting from vikrshi-media and imagePath didn't have gallery/ prefix
    if (error && bucket === 'vikrshi-media' && !imagePath.startsWith('gallery/')) {
      const fallbackPath = `gallery/${imagePath}`;
      const fallbackRes = await adminClient.storage.from('vikrshi-media').remove([fallbackPath]);
      error = fallbackRes.error;
    }

    if (error) {
      console.warn(`Failed to delete storage object ${imagePath}:`, error.message);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Storage object removed successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server error deleting storage object' },
      { status: 500 }
    );
  }
}
