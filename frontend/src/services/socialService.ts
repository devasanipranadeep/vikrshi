import { SocialPost } from '@/types';
import { instagramPosts } from '@/constants/mockData';

export const socialService = {
  async getPosts(): Promise<SocialPost[]> {
    try {
      const res = await fetch('/api/social', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
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
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.message || 'Failed to create story' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error creating story' };
    }
  },

  async deletePost(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/social?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return { success: true };
      }
      return { success: false, error: json.message || 'Failed to delete story' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error deleting story' };
    }
  },
};
