import { getBrowserClient } from '@/lib/supabase/client';

const BUCKET_NAME = 'vikrshi-media';
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export interface UploadResult {
  imageUrl: string;
  imagePath: string;
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
  const ext = parts.pop() || 'jpg';
  const cleanBase = parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .slice(0, 30);
  const timestamp = Date.now();
  return `${cleanBase}-${timestamp}.${ext}`;
}

export const storageService = {
  /**
   * Generic file uploader to vikrshi-media bucket
   */
  async uploadFile(folder: 'products' | 'categories' | 'company' | 'social', file: File): Promise<UploadResult> {
    validateFile(file);

    const client = getBrowserClient();
    const fileName = getSanitizedFileName(file.name);
    const filePath = `${folder}/${fileName}`;

    const { error } = await client.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    const { data: publicData } = client.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return {
      imageUrl: publicData.publicUrl,
      imagePath: filePath,
    };
  },

  async uploadProductImage(file: File): Promise<UploadResult> {
    return this.uploadFile('products', file);
  },

  async uploadCategoryImage(file: File): Promise<UploadResult> {
    return this.uploadFile('categories', file);
  },

  async uploadCompanyImage(file: File): Promise<UploadResult> {
    return this.uploadFile('company', file);
  },

  async uploadSocialImage(file: File): Promise<UploadResult> {
    return this.uploadFile('social', file);
  },

  /**
   * Delete media using image_path
   */
  async deleteMedia(imagePath: string): Promise<void> {
    if (!imagePath) return;
    const client = getBrowserClient();
    const { error } = await client.storage.from(BUCKET_NAME).remove([imagePath]);
    if (error) {
      console.warn(`Failed to delete media ${imagePath}:`, error.message);
    }
  },

  /**
   * Replace existing media with a new file
   */
  async replaceMedia(
    oldPath: string | null | undefined,
    newFile: File,
    folder: 'products' | 'categories' | 'company'
  ): Promise<UploadResult> {
    if (oldPath) {
      await this.deleteMedia(oldPath);
    }
    return this.uploadFile(folder, newFile);
  },
};
