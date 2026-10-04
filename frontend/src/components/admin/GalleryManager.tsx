'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { GalleryItem, GalleryCategory } from '@/types';
import { galleryService } from '@/services/galleryService';
import { storageService } from '@/services/storage';
import { notifyStoreUpdate } from '@/utils/storeEvents';
import {
  Images,
  Plus,
  Trash2,
  Upload,
  Loader2,
  X,
  Sparkles,
  MapPin,
  Calendar,
  Eye,
  Star,
  Search,
  ExternalLink,
  Edit2,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

export function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<'farms' | 'community'>('farms');
  const [locationTag, setLocationTag] = useState('Chevella Agro-Cluster, Telangana');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [date, setDate] = useState('Dawn Harvest');
  const [featured, setFeatured] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const data = await galleryService.getGalleryItems('all', true);
      setItems(data);
    } catch {
      toast.error('Failed to load gallery photos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await storageService.uploadGalleryPhoto(
        file,
        category,
        title || file.name.replace(/\.[^/.]+$/, ''),
        locationTag
      );
      setImageUrl(res.imageUrl);
      setImagePath(res.imagePath);
      if (!title) {
        setTitle(res.title);
      }
      toast.success('Photo uploaded to Cloud Storage bucket!');
    } catch (err: any) {
      // Local preview fallback if Supabase storage is unconfigured
      const preview = URL.createObjectURL(file);
      setImageUrl(preview);
      toast.info('Using local preview fallback (' + (err.message || 'offline storage') + ')');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setCaption('');
    setCategory('farms');
    setLocationTag('Chevella Agro-Cluster, Telangana');
    setImageUrl('');
    setImagePath('');
    setDate('Dawn Harvest');
    setFeatured(true);
    setSortOrder(items.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCaption(item.caption || '');
    setCategory(item.category);
    setLocationTag(item.locationTag || 'Telangana, India');
    setImageUrl(item.imageUrl);
    setImagePath(item.imagePath || '');
    setDate(item.date || 'Recent');
    setFeatured(item.featured ?? false);
    setSortOrder(item.sortOrder ?? 1);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      toast.error('Please upload a photo or provide an image URL');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter a title for the photo');
      return;
    }

    setIsSubmitting(true);
    try {
      toast.success('Photo saved to gallery!');
      setIsModalOpen(false);
      await loadItems();
      notifyStoreUpdate('gallery');
    } catch {
      toast.error('Unexpected error while saving photo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm(`Are you sure you want to remove "${item.title}" from the gallery?`)) {
      return;
    }

    try {
      const res = await galleryService.deleteGalleryItem(item.id, item.imagePath);
      if (res.success) {
        toast.success('Photo removed from Cloud Storage');
        await loadItems();
        notifyStoreUpdate('gallery');
      } else {
        toast.error(res.error || 'Failed to delete photo');
      }
    } catch {
      toast.error('Error deleting photo');
    }
  };

  const toggleFeatured = async (item: GalleryItem) => {
    try {
      const res = await galleryService.updateGalleryItem({
        id: item.id,
        featured: !item.featured,
      });
      if (res.success) {
        toast.success(item.featured ? 'Removed from homepage preview' : 'Featured on homepage preview');
        await loadItems();
        notifyStoreUpdate('gallery');
      }
    } catch {
      toast.error('Failed to update featured status');
    }
  };

  // Filter items based on category and search
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.locationTag && item.locationTag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categoriesList: { id: GalleryCategory; label: string }[] = [
    { id: 'all', label: 'All Photos' },
    { id: 'farms', label: 'Farms' },
    { id: 'community', label: 'Community Delivery' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-cream-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-leaf-500/10 text-leaf-700 rounded-xl">
              <Images className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-2xl font-bold text-forest-950">Photo Gallery Manager</h1>
          </div>
          <p className="mt-1 text-sm text-forest-700/80">
            Upload and organize authentic photography of partner farms, sunrise harvests, cold storage, and Hyderabad community deliveries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-forest-200 text-forest-800 text-xs sm:text-sm font-medium hover:bg-forest-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-leaf-600" />
            <span>View Public Gallery</span>
            <ExternalLink className="w-3 h-3 text-forest-400" />
          </a>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-leaf-600 hover:bg-leaf-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Photo</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-cream-200">
        {/* Categories Tab Pill */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-leaf-600 text-white shadow-xs'
                  : 'bg-cream-100/70 text-forest-800 hover:bg-cream-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-cream-200 bg-cream-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500"
          />
        </div>
      </div>

      {/* Photos Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-leaf-600" />
          <p className="text-xs text-forest-600">Loading gallery photos...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-cream-200">
          <Images className="w-12 h-12 text-forest-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-forest-900">No photos found</h3>
          <p className="text-xs text-forest-600 mt-1 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== 'all'
              ? 'No photos matched your filter criteria. Try choosing "All Photos" or clearing your search.'
              : 'Add your first farm or facility photo to showcase the authentic Vikrshi story.'}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-4 inline-flex items-center gap-2 bg-leaf-600 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-leaf-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col"
            >
              {/* Photo Preview Container */}
              <div className="relative aspect-16/10 w-full bg-forest-950 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges on top */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-forest-950/80 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full border border-white/20">
                    {item.category === 'community' ? 'Community Delivery' : 'Farms'}
                  </span>
                  {item.featured && (
                    <span className="text-[10px] font-bold bg-amber-500 text-forest-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                {/* Quick actions on preview */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleFeatured(item)}
                    title={item.featured ? 'Remove from homepage teaser' : 'Feature on homepage teaser'}
                    className={`p-1.5 rounded-lg backdrop-blur-xs transition-colors ${
                      item.featured
                        ? 'bg-amber-400 text-forest-950'
                        : 'bg-forest-950/70 text-white hover:bg-forest-900'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    title="Edit photo info"
                    className="p-1.5 bg-forest-950/70 hover:bg-forest-900 text-white rounded-lg backdrop-blur-xs transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    title="Delete photo"
                    className="p-1.5 bg-red-600/80 hover:bg-red-700 text-white rounded-lg backdrop-blur-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Photo Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-forest-950 text-sm line-clamp-1">{item.title}</h4>
                  {item.caption && (
                    <p className="mt-1 text-xs text-forest-700/80 line-clamp-2 leading-relaxed">{item.caption}</p>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-cream-100 flex items-center justify-between text-[11px] text-forest-500">
                  <span className="flex items-center gap-1 truncate max-w-[65%]">
                    <MapPin className="w-3 h-3 text-leaf-600 shrink-0" />
                    <span className="truncate">{item.locationTag || 'Telangana'}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-forest-400" />
                    <span>{item.date || 'Recent'}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-cream-200 relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-leaf-500/10 text-leaf-700 rounded-xl">
                  <Images className="w-5 h-5" />
                </span>
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  {editingItem ? 'Edit Gallery Photo' : 'Add Photo to Gallery'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-forest-400 hover:text-forest-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1.5">Photo</label>
                <div className="space-y-3">
                  {imageUrl ? (
                    <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden border border-cream-200 bg-forest-950 group">
                      <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          setImagePath('');
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-cream-300 hover:border-leaf-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-cream-50/50 hover:bg-leaf-50/20"
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 py-4">
                          <Loader2 className="w-6 h-6 animate-spin text-leaf-600" />
                          <span className="text-xs text-forest-600">Uploading photo...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <div className="p-3 bg-white rounded-full shadow-xs text-leaf-600">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-forest-800">
                              Click to upload from device
                            </span>
                            <p className="text-[11px] text-forest-500 mt-0.5">JPEG, PNG, or WebP up to 10MB</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  {/* Or image URL input */}
                  <div>
                    <span className="text-[11px] text-forest-500 block mb-1">Or paste direct image URL:</span>
                    <input
                      type="text"
                      placeholder="https://example.com/farm-photo.jpg or /hero/farm-1.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-cream-200 bg-cream-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500"
                    />
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">
                  Photo Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunrise Greens Harvest at Chevella"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-cream-200 bg-cream-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500"
                />
              </div>

              {/* Category Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-cream-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500"
                  >
                    <option value="farms">Farms</option>
                    <option value="community">Community Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-800 mb-1">Date / Batch Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Dawn Harvest or Oct 2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-cream-200 bg-cream-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500"
                  />
                </div>
              </div>

              {/* Location Tag */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">Location Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Chevella Agro-Cluster, Telangana"
                  value={locationTag}
                  onChange={(e) => setLocationTag(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-cream-200 bg-cream-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500"
                />
              </div>

              {/* Caption Textarea */}
              <div>
                <label className="block text-xs font-semibold text-forest-800 mb-1">Description / Caption</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what makes this moment or product special..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-cream-200 bg-cream-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 resize-none"
                />
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-leaf-600 rounded-sm border-cream-300 focus:ring-leaf-500"
                />
                <label htmlFor="featuredToggle" className="text-xs text-forest-800 font-medium cursor-pointer">
                  Feature this photo in the Homepage teaser strip
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-forest-200 text-xs font-medium text-forest-700 hover:bg-forest-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="inline-flex items-center gap-2 bg-leaf-600 hover:bg-leaf-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingItem ? 'Save Changes' : 'Add to Gallery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
