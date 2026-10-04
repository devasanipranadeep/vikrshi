import { GalleryItem } from '@/types';
import { initialGalleryItems } from '@/constants/mockData';

export const galleryService = {
  async getGalleryItems(category?: string, includeInactive = false): Promise<GalleryItem[]> {
    try {
      const url = new URL('/api/gallery', typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
      if (category && category !== 'all') {
        url.searchParams.set('category', category);
      }
      if (includeInactive) {
        url.searchParams.set('all', 'true');
      }

      const res = await fetch(url.toString(), { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
      return initialGalleryItems;
    } catch {
      return initialGalleryItems;
    }
  },

  async createGalleryItem(item: {
    title: string;
    caption?: string;
    category: 'farms' | 'community';
    locationTag?: string;
    imageUrl: string;
    imagePath?: string;
    date?: string;
    featured?: boolean;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<{ success: boolean; data?: GalleryItem; error?: string }> {
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.message || 'Failed to add photo' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error adding photo' };
    }
  },

  async updateGalleryItem(item: Partial<GalleryItem> & { id: string }): Promise<{ success: boolean; data?: GalleryItem; error?: string }> {
    try {
      const res = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.message || 'Failed to update photo' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error updating photo' };
    }
  },

  async deleteGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true };
      }
      return { success: false, error: json.message || 'Failed to delete photo' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error deleting photo' };
    }
  },
};
