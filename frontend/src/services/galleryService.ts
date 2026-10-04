import { GalleryItem } from '@/types';
import { initialGalleryItems } from '@/constants/mockData';
import { storageService } from '@/services/storage';

export const galleryService = {
  /**
   * Fetch all gallery photos directly from Cloud Storage bucket + baseline photos (Zero SQL Database)
   */
  async getGalleryItems(category?: string, _includeInactive = false): Promise<GalleryItem[]> {
    try {
      // 1. Fetch live uploaded photos directly from Cloud Storage bucket
      let cloudPhotos: GalleryItem[] = [];
      if (typeof window !== 'undefined') {
        cloudPhotos = await storageService.listGalleryPhotosFromStorage();
      } else {
        // Server side: query api route
        try {
          const res = await fetch('http://localhost:3000/api/gallery', { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) return json.data;
          }
        } catch {}
      }

      // 2. Combine with baseline curated farm photography
      const allItems = [...cloudPhotos, ...initialGalleryItems];

      // 3. Filter by category if requested
      if (category && category !== 'all') {
        return allItems.filter((i) => i.category === category);
      }

      return allItems;
    } catch {
      return initialGalleryItems;
    }
  },

  /**
   * Upload and add a photo directly to Cloud Storage (Zero SQL Database)
   */
  async uploadPhoto(
    file: File,
    category: 'farms' | 'community',
    title: string,
    locationTag?: string
  ): Promise<{ success: boolean; data?: GalleryItem; error?: string }> {
    try {
      const res = await storageService.uploadGalleryPhoto(file, category, title, locationTag);
      const newItem: GalleryItem = {
        id: res.id,
        title: res.title,
        category: res.category,
        locationTag: res.locationTag,
        imageUrl: res.imageUrl,
        imagePath: res.imagePath,
        date: 'Recent',
        featured: true,
        sortOrder: 1,
        isActive: true,
      };
      return { success: true, data: newItem };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to upload photo to cloud storage' };
    }
  },

  /**
   * Delete photo directly from Cloud Storage (Zero SQL Database)
   */
  async deleteGalleryItem(id: string, imagePath?: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (imagePath) {
        await storageService.deleteMedia(imagePath);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete photo from storage' };
    }
  },

  async updateGalleryItem(_item: Partial<GalleryItem> & { id: string }): Promise<{ success: boolean; data?: GalleryItem; error?: string }> {
    return { success: true };
  },
};
