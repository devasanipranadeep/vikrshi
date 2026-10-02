'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Category } from '@/types';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '@/actions/categories';
import { storageService } from '@/services/storage';
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Upload,
  Loader2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { notifyStoreUpdate } from '@/utils/storeEvents';

interface CategoriesManagerProps {
  categories: Category[];
  onCategoryUpdated: () => void;
}

export function CategoriesManager({ categories, onCategoryUpdated }: CategoriesManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80');
    setImagePath('');
    setIsActive(true);
    setSortOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.imageUrl || cat.image || '');
    setImagePath(cat.imagePath || '');
    setIsActive(cat.isActive !== false);
    setSortOrder(cat.sortOrder ?? 0);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading('Uploading category image...');
    try {
      const res = await storageService.uploadCategoryImage(file);
      setImageUrl(res.imageUrl);
      setImagePath(res.imagePath);
      toast.success('Category image uploaded', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, {
          name,
          slug: slug || undefined,
          description,
          imageUrl,
          imagePath,
          isActive,
          sortOrder: Number(sortOrder),
        });
        if (res.success) {
          toast.success(`Category "${name}" updated`);
          notifyStoreUpdate('categories');
          setIsModalOpen(false);
          onCategoryUpdated();
        } else {
          toast.error(res.error || 'Failed to update category');
        }
      } else {
        const res = await createCategoryAction({
          name,
          slug: slug || undefined,
          description,
          imageUrl,
          imagePath,
          isActive,
          sortOrder: Number(sortOrder),
        });
        if (res.success) {
          toast.success(`Category "${name}" created`);
          notifyStoreUpdate('categories');
          setIsModalOpen(false);
          onCategoryUpdated();
        } else {
          toast.error(res.error || 'Failed to create category');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      return;
    }

    try {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        toast.success(`Category "${catName}" deleted`);
        notifyStoreUpdate('categories');
        onCategoryUpdated();
      } else {
        toast.error(res.error || 'Failed to delete');
      }
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">Produce Categories</h2>
          <p className="text-xs text-forest-600 mt-0.5">
            Manage high-level fresh produce classifications and categories
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-xs hover:border-leaf-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-36 w-full bg-cream-100">
                <Image
                  src={cat.imageUrl || cat.image || 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=800&q=80'}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  {cat.isActive !== false ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-leaf-500/90 text-white text-[10px] font-semibold">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-500/90 text-white text-[10px] font-semibold">
                      <XCircle className="w-3 h-3" /> Inactive
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-serif text-lg font-bold text-forest-900">{cat.name}</h3>
                <p className="text-[11px] font-mono text-leaf-600 mb-2">/{cat.slug}</p>
                <p className="text-xs text-forest-700/80 line-clamp-2 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="px-4 py-3 bg-cream-50/60 border-t border-cream-200 flex items-center justify-between">
              <span className="text-[11px] text-forest-500">
                Order: {cat.sortOrder ?? 0} • {cat.itemCount ?? 0} {cat.itemCount === 1 ? 'variety' : 'varieties'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 rounded-lg text-forest-700 hover:text-leaf-600 hover:bg-cream-200 transition-colors cursor-pointer"
                  title="Edit category"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 rounded-lg text-forest-700 hover:text-red-600 hover:bg-cream-200 transition-colors cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-cream-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-forest-400 hover:text-forest-900 hover:bg-cream-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-forest-950 mb-1">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>
            <p className="text-xs text-forest-600 mb-5">
              Updates will persist directly to your catalog.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Exotic Fruits"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  URL Slug (Optional - auto-generated from name)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. exotic-fruits"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short explanation of this harvest group..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Category Cover Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl bg-cream-100 overflow-hidden shrink-0 border border-cream-200">
                    {imageUrl && (
                      <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-800 text-xs font-medium cursor-pointer transition-colors border border-cream-300">
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-leaf-600" />
                      ) : (
                        <Upload className="w-4 h-4 text-leaf-600" />
                      )}
                      <span>{isUploading ? 'Uploading image...' : 'Upload Image (JPEG/PNG/WEBP)'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or enter public URL"
                      className="mt-1.5 w-full px-3 py-1.5 rounded-lg border border-cream-200 text-[11px] text-forest-700"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Sort Order */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded border-cream-300 text-leaf-600 focus:ring-leaf-500 w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-forest-900">Active in Store</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-cream-300 text-xs font-semibold text-forest-700 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
