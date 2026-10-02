'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product, ProductUnit, AvailabilityStatus, LocationItem } from '@/types';
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  toggleProductStatusAction,
} from '@/actions/products';
import { storageService } from '@/services/storage';
import { formatCurrency } from '@/utils/formatters';
import {
  Plus,
  Search,
  Check,
  X,
  Trash2,
  Edit2,
  Sparkles,
  Loader2,
  Upload,
  CheckCircle,
  XCircle,
  Tag,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import { Category } from '@/types';
import { categoryService } from '@/services/categories';
import { notifyStoreUpdate } from '@/utils/storeEvents';

interface ProductsManagerProps {
  products: Product[];
  categories?: Category[];
  locations?: LocationItem[];
  onProductUpdated: () => void;
}

export function ProductsManager({
  products,
  categories = [],
  locations = [],
  onProductUpdated,
}: ProductsManagerProps) {
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [categoriesList, setCategoriesList] = useState<Category[]>(categories);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoriesList(categories);
    } else {
      categoryService.getCategories(true).then((data) => {
        if (data && data.length > 0) setCategoriesList(data);
      });
    }
  }, [categories]);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [unit, setUnit] = useState<ProductUnit>('kg');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [organic, setOrganic] = useState(true);
  const [seasonal, setSeasonal] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('in_stock');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // City-specific pricing & availability settings
  const [citySettings, setCitySettings] = useState<
    Record<string, { isAvailable: boolean; customPrice: string }>
  >({});

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setCategoryId(categoriesList[0]?.id || '');
    setPrice('50');
    setCompareAtPrice('');
    setUnit('kg');
    setShortDescription('Freshly harvested organic produce directly from Telangana partner farms.');
    setDescription('Cultivated naturally using Vedic organic composting with zero synthetic chemical sprays.');
    setImageUrl('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80');
    setImagePath('');
    setOrganic(true);
    setSeasonal(false);
    setFeatured(false);
    setAvailabilityStatus('in_stock');
    setIsActive(true);
    setSortOrder(products.length + 1);

    const initCitySettings: Record<string, { isAvailable: boolean; customPrice: string }> = {};
    locations.forEach((loc) => {
      initCitySettings[loc.id] = { isAvailable: true, customPrice: '' };
    });
    setCitySettings(initCitySettings);

    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    const matchingCat = categoriesList.find(
      (c) => c.id === p.categoryId || c.slug === p.category
    );
    setCategoryId(p.categoryId || matchingCat?.id || '');
    setPrice(String(p.price));
    setCompareAtPrice(p.originalPrice || p.compareAtPrice ? String(p.originalPrice || p.compareAtPrice) : '');
    setUnit((p.unit as ProductUnit) || 'kg');
    setShortDescription(p.shortDescription || '');
    setDescription(p.description || '');
    setImageUrl(p.imageUrl || p.image || '');
    setImagePath(p.imagePath || '');
    setOrganic(p.isOrganic);
    setSeasonal(p.isSeasonal);
    setFeatured(p.isFeatured);
    setAvailabilityStatus((p.availabilityStatus as AvailabilityStatus) || 'in_stock');
    setIsActive(p.isActive !== false);
    setSortOrder(p.sortOrder ?? 0);

    const initCitySettings: Record<string, { isAvailable: boolean; customPrice: string }> = {};
    locations.forEach((loc) => {
      initCitySettings[loc.id] = {
        isAvailable: p.locationAvailability?.[loc.id] !== false,
        customPrice: p.locationPrices?.[loc.id] ? String(p.locationPrices[loc.id]) : '',
      };
    });
    setCitySettings(initCitySettings);

    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading('Uploading product image...');
    try {
      const res = await storageService.uploadProductImage(file);
      setImageUrl(res.imageUrl);
      setImagePath(res.imagePath);
      toast.success('Product image uploaded', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      toast.error('Product name and price are required');
      return;
    }

    const locationSettingsPayload = Object.entries(citySettings).map(([locId, cfg]) => ({
      locationId: locId,
      isAvailable: cfg.isAvailable,
      customPrice: cfg.customPrice ? Number(cfg.customPrice) : null,
      availabilityStatus: null,
    }));

    setIsSubmitting(true);
    try {
      if (editingProduct) {
        const res = await updateProductAction(editingProduct.id, {
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
          organic,
          seasonal,
          featured,
          availabilityStatus,
          isActive,
          sortOrder: Number(sortOrder),
          locationSettings: locationSettingsPayload,
        });

        if (res.success) {
          toast.success(`Product "${name}" updated`);
          notifyStoreUpdate('products');
          notifyStoreUpdate('categories');
          setIsModalOpen(false);
          onProductUpdated();
        } else {
          toast.error(res.error || 'Failed to update product');
        }
      } else {
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
          isActive,
          sortOrder: Number(sortOrder),
          locationSettings: locationSettingsPayload,
        });

        if (res.success) {
          toast.success(`Product "${name}" created`);
          notifyStoreUpdate('products');
          notifyStoreUpdate('categories');
          setIsModalOpen(false);
          onProductUpdated();
        } else {
          toast.error(res.error || 'Failed to create product');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStock = async (product: Product) => {
    const isCurrentlyInStock = product.availabilityStatus !== 'out_of_stock' && product.inStock;
    const nextStatus: AvailabilityStatus = isCurrentlyInStock ? 'out_of_stock' : 'in_stock';
    const nextInStock = !isCurrentlyInStock;

    setTogglingId(product.id);

    // Optimistic UI update
    setLocalProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, availabilityStatus: nextStatus, inStock: nextInStock }
          : p
      )
    );

    try {
      const res = await updateProductAction(product.id, {
        availabilityStatus: nextStatus,
      });

      if (res.success) {
        toast.success(`${product.name} is now ${nextStatus === 'in_stock' ? 'In Stock' : 'Sold Out'}`);
        notifyStoreUpdate('products');
        notifyStoreUpdate('categories');
        onProductUpdated();
      } else {
        // Rollback on failure
        setLocalProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? { ...p, availabilityStatus: product.availabilityStatus, inStock: product.inStock }
              : p
          )
        );
        toast.error(res.error || 'Failed to update stock');
      }
    } catch (err: any) {
      // Rollback on network failure
      setLocalProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? { ...p, availabilityStatus: product.availabilityStatus, inStock: product.inStock }
            : p
        )
      );
      toast.error(err?.message || 'Network error updating stock');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (!window.confirm(`Are you sure you want to remove "${prodName}" from the catalog?`)) {
      return;
    }
    try {
      const res = await deleteProductAction(id);
      if (res.success) {
        toast.success(`Product "${prodName}" removed`);
        notifyStoreUpdate('products');
        notifyStoreUpdate('categories');
        onProductUpdated();
      } else {
        toast.error(res.error || 'Failed to delete');
      }
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const filteredProducts = localProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.categoryName || '').toLowerCase().includes(search.toLowerCase());
    const targetCat = categoriesList.find((c) => c.slug === categoryFilter);
    const matchesCat =
      categoryFilter === 'all' ||
      p.category.toLowerCase() === categoryFilter.toLowerCase() ||
      (targetCat && p.categoryId === targetCat.id);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">Produce Catalog & Inventory</h2>
          <p className="text-xs text-forest-600 mt-0.5">
            Manage fresh harvest, location-specific pricing, and stock status
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-cream-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search produce name, category or origin..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-cream-50/70 border border-cream-200 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-leaf-600 text-white shadow-xs'
                : 'bg-cream-100/70 text-forest-700 hover:bg-cream-200'
            }`}
          >
            All Produce ({localProducts.length})
          </button>
          {categoriesList.map((cat) => {
            const count = localProducts.filter(
              (p) => p.categoryId === cat.id || p.category === cat.slug
            ).length;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat.slug
                    ? 'bg-leaf-600 text-white shadow-xs'
                    : 'bg-cream-100/70 text-forest-700 hover:bg-cream-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-cream-200">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.availabilityStatus === 'out_of_stock' || !p.inStock;

            return (
              <div
                key={p.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cream-50/40 transition-colors"
              >
                {/* Left Thumbnail and info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-16 h-16 rounded-xl bg-cream-100 overflow-hidden shrink-0 border border-cream-200">
                    <Image
                      src={p.imageUrl || p.image}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-serif font-bold text-forest-950 text-sm truncate">
                        {p.name}
                      </h4>
                      {p.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-800 text-[10px] font-bold">
                          Featured
                        </span>
                      )}
                      {p.isSeasonal && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          Seasonal
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-forest-600">
                      <span className="capitalize font-semibold text-leaf-700">
                        {p.categoryName || categoriesList.find((c) => c.id === p.categoryId || c.slug === p.category)?.name || p.category}
                      </span>
                      <span>•</span>
                      <span className="font-mono font-bold text-forest-900">
                        {formatCurrency(p.price)} / {p.unit}
                      </span>
                      {p.originalPrice && (
                        <span className="line-through text-forest-400">
                          {formatCurrency(p.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Stock Toggle button */}
                  <button
                    onClick={() => handleToggleStock(p)}
                    disabled={togglingId === p.id}
                    title="Click to toggle stock status"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors disabled:opacity-60 ${
                      !isOutOfStock
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    {togglingId === p.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : !isOutOfStock ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{!isOutOfStock ? 'In Stock' : 'Sold Out'}</span>
                  </button>

                  <button
                    onClick={() => openEditModal(p)}
                    className="p-2 rounded-lg text-forest-600 hover:text-leaf-600 hover:bg-cream-100 transition-colors"
                    title="Edit product details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="p-2 rounded-lg text-forest-400 hover:text-red-600 hover:bg-cream-100 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-forest-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-cream-200 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-forest-950">
                  {editingProduct ? 'Edit Product Item' : 'Add Product Item'}
                </h3>
                <p className="text-xs text-forest-600">
                  Configure base details, product images, and city-specific pricing
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-forest-400 hover:text-forest-900 hover:bg-cream-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                    placeholder="e.g. Organic Country Tomatoes"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="organic-country-tomatoes"
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
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Harvest Unit *
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
                    <option value="bunch">bunch (Leafy greens)</option>
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
                    placeholder="45"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="55"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Product Cover Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl bg-cream-100 overflow-hidden shrink-0 border border-cream-200">
                    {imageUrl && (
                      <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 w-full space-y-1.5">
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
                  placeholder="Appears on shop cards..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Full Farming & Harvest Details
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Cultivation practices, Vedic composting details..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-cream-50/60 border border-cream-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={organic}
                    onChange={(e) => setOrganic(e.target.checked)}
                    className="rounded border-cream-300 text-leaf-600 focus:ring-leaf-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-forest-900">100% Organic</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={seasonal}
                    onChange={(e) => setSeasonal(e.target.checked)}
                    className="rounded border-cream-300 text-leaf-600 focus:ring-leaf-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-forest-900">Seasonal</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded border-cream-300 text-leaf-600 focus:ring-leaf-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-forest-900">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-cream-300 text-leaf-600 focus:ring-leaf-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-forest-900">Active</span>
                </label>
              </div>

              {/* Multi-City Specific Pricing & Availability */}
              {locations.length > 0 && (
                <div className="pt-2 border-t border-cream-200">
                  <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-leaf-600" />
                    <span>City-Specific Availability & Custom Pricing (Optional)</span>
                  </h4>
                  <p className="text-[11px] text-forest-600 mb-3">
                    Leave custom price empty to use default price (₹{price || '0'}).
                  </p>

                  <div className="space-y-2">
                    {locations.map((loc) => {
                      const cfg = citySettings[loc.id] || { isAvailable: true, customPrice: '' };

                      return (
                        <div
                          key={loc.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-cream-200"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={cfg.isAvailable}
                              onChange={(e) =>
                                setCitySettings((prev) => ({
                                  ...prev,
                                  [loc.id]: { ...cfg, isAvailable: e.target.checked },
                                }))
                              }
                              className="rounded border-cream-300 text-leaf-600 focus:ring-leaf-500 w-4 h-4"
                            />
                            <span className="text-xs font-bold text-forest-900">
                              {loc.cityName}, {loc.state}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-forest-600">Custom Price (₹):</span>
                            <input
                              type="number"
                              step="0.01"
                              placeholder={`Default (₹${price || '0'})`}
                              value={cfg.customPrice}
                              onChange={(e) =>
                                setCitySettings((prev) => ({
                                  ...prev,
                                  [loc.id]: { ...cfg, customPrice: e.target.value },
                                }))
                              }
                              className="w-32 px-2.5 py-1 rounded-lg border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
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
                  className="px-6 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Create Product Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
