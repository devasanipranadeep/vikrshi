import { getBrowserClient } from '@/lib/supabase/client';

const BUCKET_NAME = 'vikrshi-media';
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export type StorageFolder = 'products' | 'categories' | 'company' | 'social' | 'gallery';

export interface UploadResult {
  imageUrl: string;
  imagePath: string;
  bucket?: string;
}

function validateFile(file: File) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type (${file.type}). Allowed: JPEG, PNG, WEBP.`);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max limit is 10MB.`);
  }
}

function getSanitizedFileName(originalName: string): string {
  const parts = originalName.split('.');
  const ext = (parts.pop() || 'jpg').toLowerCase();
  const cleanBase = parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .slice(0, 30);
  const timestamp = Date.now();
  return `${cleanBase || 'media'}-${timestamp}.${ext}`;
}

export const storageService = {
  /**
   * Primary file uploader to Supabase buckets (via server-side admin API, with direct client fallback)
   */
  async uploadFile(folder: StorageFolder, file: File, customBucket?: string): Promise<UploadResult> {
    validateFile(file);

    const targetBucket = customBucket || BUCKET_NAME;

    // 1. First attempt: Use the secure server API route which has full Supabase service-role permissions
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('bucket', targetBucket);

      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.imageUrl) {
          return {
            imageUrl: json.imageUrl,
            imagePath: json.imagePath,
            bucket: json.bucket || targetBucket,
          };
        }
      }
    } catch {
      // If server API route is unreachable, fall through to direct browser client
    }

    // 2. Direct browser client upload fallback
    const client = getBrowserClient();
    const fileName = getSanitizedFileName(file.name);
    const filePath = `${folder}/${fileName}`;

    const { error } = await client.storage.from(targetBucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    const { data: publicData } = client.storage.from(targetBucket).getPublicUrl(filePath);

    return {
      imageUrl: publicData.publicUrl,
      imagePath: filePath,
      bucket: targetBucket,
    };
  },

  async uploadGalleryImage(file: File): Promise<UploadResult> {
    return this.uploadFile('gallery', file, BUCKET_NAME);
  },

  async uploadProductImage(file: File): Promise<UploadResult> {
    return this.uploadFile('products', file, 'vikrshi-media');
  },

  async uploadCategoryImage(file: File): Promise<UploadResult> {
    return this.uploadFile('categories', file, 'vikrshi-media');
  },

  async uploadCompanyImage(file: File): Promise<UploadResult> {
    return this.uploadFile('company', file, 'vikrshi-media');
  },

  async uploadSocialImage(file: File): Promise<UploadResult> {
    return this.uploadGalleryImage(file);
  },

  /**
   * Delete media using image_path
   */
  async deleteMedia(imagePath: string, bucket: string = BUCKET_NAME): Promise<void> {
    if (!imagePath) return;

    // 1. Try server API route
    try {
      const res = await fetch(`/api/storage/upload?imagePath=${encodeURIComponent(imagePath)}&bucket=${encodeURIComponent(bucket)}`, {
        method: 'DELETE',
      });
      if (res.ok) return;
    } catch {
      // Fall through to browser client
    }

    // 2. Direct browser client fallback
    try {
      const client = getBrowserClient();
      await client.storage.from(bucket).remove([imagePath]);
    } catch (err: any) {
      console.warn(`Failed to delete media ${imagePath}:`, err.message);
    }
  },

  /**
   * Replace existing media with a new file
   */
  async replaceMedia(
    oldPath: string | null | undefined,
    newFile: File,
    folder: StorageFolder = 'gallery',
    bucket?: string
  ): Promise<UploadResult> {
    if (oldPath) {
      await this.deleteMedia(oldPath, bucket);
    }
    return this.uploadFile(folder, newFile, bucket);
  },
};
