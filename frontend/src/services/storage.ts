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
  async uploadFile(folder: 'products' | 'categories' | 'company' | 'social' | 'gallery', file: File): Promise<UploadResult> {
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

  async uploadGalleryImage(file: File): Promise<UploadResult> {
    return this.uploadFile('gallery', file);
  },

  /**
   * Upload a photo to the gallery cloud storage bucket (Zero database)
   */
  async uploadGalleryPhoto(
    file: File,
    category: 'farms' | 'community',
    title: string,
    locationTag?: string
  ): Promise<UploadResult & { id: string; title: string; category: 'farms' | 'community'; locationTag: string }> {
    validateFile(file);

    const client = getBrowserClient();
    const ext = file.name.split('.').pop() || 'jpg';
    const cleanTitle = (title || 'farm-photo')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 35);
    const cleanLocation = (locationTag || 'Telangana')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .slice(0, 25);
    const timestamp = Date.now();
    const fileName = `${cleanTitle}__${cleanLocation}__${timestamp}.${ext}`;
    const filePath = `gallery/${category}/${fileName}`;

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
      id: `cloud-${timestamp}`,
      title,
      category,
      locationTag: locationTag || 'Telangana, India',
    };
  },

  /**
   * Read all photos directly from the cloud storage bucket (Zero database)
   */
  async listGalleryPhotosFromStorage(): Promise<any[]> {
    try {
      const client = getBrowserClient();
      const categories: ('farms' | 'community')[] = ['farms', 'community'];
      const items: any[] = [];

      for (const cat of categories) {
        const { data, error } = await client.storage.from(BUCKET_NAME).list(`gallery/${cat}`, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        });

        if (!error && Array.isArray(data)) {
          for (const file of data) {
            if (file.name === '.emptyFolderPlaceholder') continue;

            const filePath = `gallery/${cat}/${file.name}`;
            const { data: publicData } = client.storage.from(BUCKET_NAME).getPublicUrl(filePath);

            // Parse metadata encoded in filename: `${cleanTitle}__${cleanLocation}__${timestamp}.${ext}`
            const nameParts = file.name.replace(/\.[^/.]+$/, '').split('__');
            const rawTitle = nameParts[0] || 'Farm Photo';
            const rawLocation = nameParts[1] || 'Telangana, India';

            const formattedTitle = rawTitle
              .split('-')
              .filter(Boolean)
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');

            const formattedLocation = rawLocation
              .split('-')
              .filter(Boolean)
              .join(' ');

            items.push({
              id: `storage-${file.id || file.name}`,
              title: formattedTitle || 'Vikrshi Farm Photo',
              caption: '',
              category: cat,
              locationTag: formattedLocation || (cat === 'community' ? 'Hyderabad Delivery Hub' : 'Telangana Farm Cluster'),
              imageUrl: publicData.publicUrl,
              imagePath: filePath,
              date: file.created_at ? new Date(file.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recent',
              featured: true,
              sortOrder: 1,
              isActive: true,
            });
          }
        }
      }

      return items;
    } catch (e) {
      console.warn('Could not list gallery photos directly from storage bucket:', e);
      return [];
    }
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
