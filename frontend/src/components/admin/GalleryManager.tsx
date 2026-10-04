'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { SocialPost } from '@/types';
import { socialService } from '@/services/socialService';
import { storageService } from '@/services/storage';
import { notifyStoreUpdate } from '@/utils/storeEvents';
import {
  Camera,
  Plus,
  Trash2,
  ExternalLink,
  Upload,
  Heart,
  Loader2,
  X,
  Sparkles,
  Link as LinkIcon,
  Calendar,
} from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';
import { toast } from 'sonner';

export function GalleryManager() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [imageUrl, setImageUrl] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [caption, setCaption] = useState('');
  const [postUrl, setPostUrl] = useState('https://instagram.com/vikrshi');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await socialService.getPosts();
      setPosts(data);
    } catch {
      toast.error('Failed to load farm stories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await storageService.uploadSocialImage(file);
      setImageUrl(res.imageUrl);
      setImagePath(res.imagePath);
      toast.success('Story image uploaded successfully!');
    } catch (err: any) {
      // If Supabase storage is not configured, fallback to local object URL or direct preview
      const preview = URL.createObjectURL(file);
      setImageUrl(preview);
      toast.info('Using local preview (Storage: ' + (err.message || 'offline fallback') + ')');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenAddModal = () => {
    setImageUrl('');
    setImagePath('');
    setCaption('');
    setPostUrl('https://instagram.com/vikrshi');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      toast.error('Please upload an image or provide an image URL');
      return;
    }
    if (!caption.trim()) {
      toast.error('Please enter a caption for this farm story');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await socialService.createPost({
        imageUrl: imageUrl.trim(),
        imagePath: imagePath || undefined,
        caption: caption.trim(),
        likes: 0,
        date: 'Today',
        postUrl: postUrl.trim() || undefined,
      });

      if (res.success) {
        toast.success('New farm story added to website!');
        notifyStoreUpdate('social');
        setIsModalOpen(false);
        loadPosts();
      } else {
        toast.error(res.error || 'Failed to publish story');
      }
    } catch (err: any) {
      toast.error(err.message || 'Network error creating story');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (post: SocialPost) => {
    if (!confirm('Are you sure you want to remove this farm story?')) return;

    try {
      const res = await socialService.deletePost(post.id);
      if (res.success) {
        toast.success('Story removed');
        notifyStoreUpdate('social');
        loadPosts();
      } else {
        toast.error(res.error || 'Failed to remove story');
      }
    } catch {
      toast.error('Network error deleting story');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-forest-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-200">
              <Camera className="w-3.5 h-3.5" />
              Social Community Feed
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">
            Gallery
          </h2>
          <p className="text-xs sm:text-sm text-forest-600 mt-0.5">
            Add live harvest photos, field moments, and Instagram updates displayed dynamically on the storefront.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold shadow-md transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Story</span>
        </button>
      </div>

      {/* Stories Grid */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-cream-200">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-leaf-600 mb-2" />
          <p className="text-xs text-forest-600">Loading social stories...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-cream-200">
          <Camera className="w-12 h-12 mx-auto text-forest-300 mb-3" />
          <h3 className="font-serif text-lg font-bold text-forest-950">No Stories Published Yet</h3>
          <p className="text-xs text-forest-600 mt-1 max-w-sm mx-auto mb-4">
            Upload your first farm photo or story to engage families on the homepage.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-leaf-600 text-white text-xs font-bold shadow-sm hover:bg-leaf-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Farm Story</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-cream-200 shadow-2xs hover:shadow-md transition-all"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square w-full bg-cream-100 overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.caption}
                  fill
                  className="object-cover"
                  sizes="280px"
                  unoptimized={post.imageUrl.startsWith('data:') || post.imageUrl.includes('supabase.co')}
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <button
                    onClick={() => handleDelete(post)}
                    className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    title="Delete story"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-red-400 text-red-400" />
                  {post.likes}
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <p className="text-xs text-forest-800 line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>

                <div className="mt-3 pt-2 border-t border-cream-100 flex items-center justify-between text-[11px] text-forest-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-forest-400" />
                    {post.date}
                  </span>
                  <a
                    href={post.postUrl || 'https://instagram.com/vikrshi'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Link</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Story Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-forest-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-cream-200">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200 inline-block mb-1">
                  New Farm Story
                </span>
                <h3 className="font-serif text-xl font-bold text-forest-950">
                  Add Farm Journey Image
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-cream-100 text-forest-400 hover:text-forest-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1.5">
                  Story Image *
                </label>

                <div className="flex gap-2 mb-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-leaf-400 bg-leaf-50/50 hover:bg-leaf-50 text-leaf-700 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-leaf-600" />
                        <span>Uploading image...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-leaf-600" />
                        <span>Upload photo from device</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste image URL (https://...)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                  />
                </div>

                {/* Preview Thumbnail */}
                {imageUrl && (
                  <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-cream-200 shadow-inner bg-cream-100">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Caption / Story Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Dawn harvest at Chevella partner farm. Fresh leafy greens arriving crisp. 🌿 #VikrshiFarms"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                />
              </div>


              {/* Link */}
              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Instagram / Reel URL (Optional)
                </label>
                <input
                  type="url"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  placeholder="https://instagram.com/p/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-forest-700 hover:bg-cream-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <span>Publish Story</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
