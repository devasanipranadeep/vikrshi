'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { createProductAction } from '@/actions/products';
import { storageService } from '@/services/storage';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { ProductUnit, AvailabilityStatus, Category } from '@/types';
import { categoryService } from '@/services/categories';
import { notifyStoreUpdate } from '@/utils/storeEvents';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [categoryId, setCategoryId] = React.useState<string>('');
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [price, setPrice] = React.useState('50');
  const [compareAtPrice, setCompareAtPrice] = React.useState('');
  const [unit, setUnit] = React.useState<ProductUnit>('kg');
  const [shortDescription, setShortDescription] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80');
  const [imagePath, setImagePath] = React.useState('');
  const [organic, setOrganic] = React.useState(true);
  const [seasonal, setSeasonal] = React.useState(false);
  const [featured, setFeatured] = React.useState(false);
  const [availabilityStatus, setAvailabilityStatus] = React.useState<AvailabilityStatus>('in_stock');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    categoryService.getCategories(true).then((data) => {
      if (data && data.length > 0) {
        setCategories(data);
        setCategoryId(data[0].id);
      }
    });
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading('Uploading image...');
    try {
      const res = await storageService.uploadProductImage(file);
      setImageUrl(res.imageUrl);
      setImagePath(res.imagePath);
      toast.success('Image uploaded', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Upload failed', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      toast.error('Name and price are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createProductAction({
        name,
        slug: slug || undefined,
        categoryId: categoryId || null,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        unit,
        shortDescription,
        description,
        imageUrl,
        imagePath,
        galleryImages: [],
        organic,
        seasonal,
        featured,
        availabilityStatus,
        isActive: true,
        sortOrder: 0,
      });

      if (res.success) {
        toast.success(`Product "${name}" created!`);
        notifyStoreUpdate('products');
        notifyStoreUpdate('categories');
        router.push('/admin/products');
      } else {
        toast.error(res.error || 'Failed to create product');
      }
    } catch (err: any) {
      toast.error(err.message || 'Creation error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminWrapper activeTab="products">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-forest-600 hover:text-forest-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-sm">
          <h2 className="font-serif text-2xl font-bold text-forest-950 mb-1">
            Add Fresh Harvest Product
          </h2>
          <p className="text-xs text-forest-600 mb-6">
            Add a new fresh produce item to your catalog
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Heirloom Organic Tomatoes"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  URL Slug (Auto-generated if empty)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="heirloom-organic-tomatoes"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Produce Category *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 bg-white font-medium"
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Unit *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as ProductUnit)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 bg-white"
                >
                  <option value="kg">kg (Kilogram)</option>
                  <option value="500g">500g</option>
                  <option value="250g">250g</option>
                  <option value="piece">piece</option>
                  <option value="dozen">dozen</option>
                  <option value="bunch">bunch</option>
                  <option value="box">box</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Compare At Price (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Product Image
              </label>
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl bg-cream-100 overflow-hidden shrink-0 border border-cream-200">
                  {imageUrl && <Image src={imageUrl} alt="Preview" fill className="object-cover" />}
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-800 text-xs font-medium cursor-pointer transition-colors border border-cream-300">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-leaf-600" /> : <Upload className="w-4 h-4 text-leaf-600" />}
                    <span>Upload Image</span>
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
                    placeholder="Or enter public image URL"
                    className="w-full px-3 py-1.5 rounded-lg border border-cream-200 text-xs text-forest-700"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest-900 mb-1">
                Full Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
              <Link
                href="/admin/products"
                className="px-4 py-2.5 rounded-xl border border-cream-300 text-xs font-semibold text-forest-700 hover:bg-cream-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Create Product</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminWrapper>
  );
}
