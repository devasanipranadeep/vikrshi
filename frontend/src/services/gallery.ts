import { SocialPost } from '@/types';
import { instagramPosts } from '@/constants/mockData';

export const galleryService = {
  async getPosts(): Promise<SocialPost[]> {
    try {
      const res = await fetch('/api/gallery', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
      // Fallback attempt to /api/social if needed
      const fallbackRes = await fetch('/api/social', { cache: 'no-store' });
      if (fallbackRes.ok) {
        const json = await fallbackRes.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
      return instagramPosts.map((p) => ({
        id: p.id,
        imageUrl: p.imageUrl,
        caption: p.caption,
        likes: p.likes,
        date: p.date,
        postUrl: 'https://instagram.com/vikrshi',
        isActive: true,
      }));
    } catch {
      return instagramPosts.map((p) => ({
        id: p.id,
        imageUrl: p.imageUrl,
        caption: p.caption,
        likes: p.likes,
        date: p.date,
        postUrl: 'https://instagram.com/vikrshi',
        isActive: true,
      }));
    }
  },

  async createPost(post: {
    imageUrl: string;
    imagePath?: string;
    caption: string;
    likes?: number;
    date?: string;
    postUrl?: string;
  }): Promise<{ success: boolean; data?: SocialPost; error?: string }> {
    try {
      let res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      if (!res.ok) {
        res = await fetch('/api/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post),
        });
      }
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.message || 'Failed to create gallery post' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error creating gallery post' };
    }
  },

  async deletePost(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      let res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        res = await fetch(`/api/social?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
      }
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true };
      }
      return { success: false, error: json.message || 'Failed to delete gallery post' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error deleting gallery post' };
    }
  },
};
