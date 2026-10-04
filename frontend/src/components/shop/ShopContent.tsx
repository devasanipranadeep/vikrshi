'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, LocationItem, Category } from '@/types';
import { productService } from '@/services/products';
import { locationService } from '@/services/locations';
import { categoryService } from '@/services/categories';
import { initialProducts, initialCategories } from '@/constants/mockData';
import { ProductCard } from '@/components/products/ProductCard';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';
import { useLocation } from '@/context/LocationContext';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  MapPin,
  RotateCcw,
  Check,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedLocation, setSelectedLocation } = useLocation();

  const initialCat = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>(initialCategories);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState(initialCat);
  const [locationFilter, setLocationFilter] = useState('all');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [onlySeasonal, setOnlySeasonal] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(300);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category param if changes from header
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setCategory(cat);
    }
    const q = searchParams.get('search');
    if (q) {
      setSearch(q);
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [prodData, locData, catData] = await Promise.all([
          productService.getProducts(),
          locationService.getLocations(),
          categoryService.getCategories(),
        ]);
        if (isMounted) {
          setProducts(prodData || initialProducts);
          if (locData && locData.length > 0) setLocations(locData);
          if (catData && catData.length > 0) setDbCategories(catData);
        }
      } catch {
        if (isMounted) setProducts(initialProducts);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();

    const unsubscribe = subscribeToStoreUpdates(() => {
      loadData();
    }, ['products', 'categories', 'locations', 'all']);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const categories = useMemo(() => {
    const emojiMap: Record<string, string> = {
      vegetables: '🥕',
      fruits: '🍎',
      'leafy-greens': '🥬',
      greens: '🥬',
      'seasonal-produce': '✨',
      'seasonal-products': '✨',
      seasonal: '✨',
    };

    const list = [
      { label: 'All Products', value: 'all', emoji: '🌱', count: products.length },
    ];

    dbCategories.forEach((cat) => {
      const count = products.filter(
        (p) =>
          p.categoryId === cat.id ||
          p.category === cat.slug ||
          (cat.slug === 'leafy-greens' && p.category === 'greens') ||
          ( (cat.slug === 'seasonal-produce' || cat.slug === 'seasonal-products') && (p.category === 'seasonal' || p.category === 'seasonal-products') )
      ).length;

      list.push({
        label: cat.name,
        value: cat.slug,
        emoji: emojiMap[cat.slug] || '🌿',
        count,
      });
    });

    return list;
  }, [dbCategories, products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.shortDescription || '').toLowerCase().includes(q) ||
          (p.categoryName || p.category || '').toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== 'all') {
      const catLower = category.toLowerCase();
      result = result.filter((p) => {
        const pCat = (p.category || '').toLowerCase();
        return (
          pCat === catLower ||
          p.categoryId === category ||
          (catLower === 'greens' && pCat === 'leafy-greens') ||
          (catLower === 'leafy-greens' && pCat === 'greens') ||
          (catLower === 'seasonal' && (pCat === 'seasonal-produce' || pCat === 'seasonal-products')) ||
          ((catLower === 'seasonal-produce' || catLower === 'seasonal-products') && pCat === 'seasonal')
        );
      });
    }

    // Location
    if (locationFilter !== 'all') {
      result = result.filter(
        (p) =>
          p.availableLocations.includes('all') ||
          p.availableLocations.some(
            (loc) => loc.toLowerCase() === locationFilter.toLowerCase()
          )
      );
    }

    // Organic filter
    if (onlyOrganic) {
      result = result.filter((p) => p.isOrganic);
    }

    // Seasonal filter
    if (onlySeasonal) {
      result = result.filter((p) => p.isSeasonal);
    }

    // In-stock filter
    if (onlyInStock) {
      result = result.filter((p) => p.inStock && p.availabilityStatus !== 'out_of_stock');
    }

    // Price filter
    result = result.filter((p) => p.price <= maxPrice);

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      // Default: prioritize in-stock items, then featured
      result.sort((a, b) => {
        const aStock = a.inStock && a.availabilityStatus !== 'out_of_stock' ? 1 : 0;
        const bStock = b.inStock && b.availabilityStatus !== 'out_of_stock' ? 1 : 0;
        if (aStock !== bStock) return bStock - aStock;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
    }

    return result;
  }, [products, search, category, locationFilter, onlyOrganic, onlySeasonal, onlyInStock, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setLocationFilter('all');
    setOnlyOrganic(false);
    setOnlySeasonal(false);
    setOnlyInStock(false);
    setMaxPrice(300);
    setSortBy('featured');
    router.replace('/shop');
  };

  const activeFilterCount =
    (category !== 'all' ? 1 : 0) +
    (locationFilter !== 'all' ? 1 : 0) +
    (onlyOrganic ? 1 : 0) +
    (onlySeasonal ? 1 : 0) +
    (maxPrice < 300 ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="pt-24 pb-20 bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Banner */}
        <div className="rounded-3xl bg-forest-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden mb-10 border border-leaf-500/20">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-300 bg-leaf-500/20 px-3 py-1 rounded-full inline-block border border-leaf-400/30">
              Farm Dispatch Catalog
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Fresh Organic Harvest
            </h1>
            <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed">
              Harvested daily across Telangana partner farms. Select items to order directly on WhatsApp or build your custom vegetable crate.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-leaf-200">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span>Current Delivery Hub: <strong className="text-white">{selectedLocation}</strong></span>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 w-80 h-80 bg-leaf-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Search & Top Action Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-700/60" />
            <input
              type="text"
              placeholder="Search products (e.g. Tomato, Palak, Carrots)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-white border border-cream-200 py-2.5 pl-10 pr-9 text-xs sm:text-sm text-forest-950 placeholder:text-forest-700/50 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 shadow-2xs"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-700/50 hover:text-forest-950"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Controls: Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 rounded-xl bg-white border border-cream-200 px-4 py-2.5 text-xs font-semibold text-forest-900 shadow-2xs"
            >
              <SlidersHorizontal className="h-4 w-4 text-leaf-600" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-leaf-500 text-white text-[10px]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-forest-700/70 hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none rounded-xl bg-white border border-cream-200 py-2.5 pl-3.5 pr-8 text-xs font-semibold text-forest-900 shadow-2xs focus:border-leaf-500 focus:outline-none"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-forest-700/60 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Sidebar + Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="rounded-2xl bg-white p-6 border border-cream-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cream-200">
                <span className="font-serif text-lg font-bold text-forest-950 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-leaf-600" />
                  Filters
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-forest-700/60 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700/70 mb-3">
                  Category
                </h4>
                <div className="space-y-1.5">
                  {categories.map((cat) => {
                    const active = category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all text-left cursor-pointer ${
                          active
                            ? 'bg-forest-900 text-white font-semibold shadow-xs'
                            : 'text-forest-800 hover:bg-cream-100'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{cat.emoji}</span>
                          <span>{cat.label}</span>
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-cream-100 text-forest-700'
                          }`}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700/70 mb-3">
                  Delivery Location
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setLocationFilter('all')}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors text-left ${
                      locationFilter === 'all'
                        ? 'bg-forest-900 text-white font-semibold'
                        : 'text-forest-800 hover:bg-cream-100'
                    }`}
                  >
                    <span>All Locations</span>
                    {locationFilter === 'all' && <Check className="h-3.5 w-3.5" />}
                  </button>
                  {locations
                    .filter((l) => l.isActive)
                    .map((loc) => {
                      const active = locationFilter.toLowerCase() === loc.cityName.toLowerCase();
                      return (
                        <button
                          key={loc.id}
                          onClick={() => setLocationFilter(loc.cityName.toLowerCase())}
                          className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors text-left ${
                            active
                              ? 'bg-forest-900 text-white font-semibold'
                              : 'text-forest-800 hover:bg-cream-100'
                          }`}
                        >
                          <span>{loc.cityName}</span>
                          {active && <Check className="h-3.5 w-3.5" />}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold uppercase tracking-wider text-forest-700/70">
                    Max Price
                  </span>
                  <span className="font-bold text-forest-950">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-leaf-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-forest-700/50 mt-1">
                  <span>₹20</span>
                  <span>₹300</span>
                </div>
              </div>

              {/* Organic, Seasonal & In-Stock Toggles */}
              <div className="space-y-2 pt-2 border-t border-cream-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-forest-900 font-medium">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded text-leaf-500 focus:ring-leaf-400 h-4 w-4"
                  />
                  <span>In-Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-forest-900 font-medium">
                  <input
                    type="checkbox"
                    checked={onlyOrganic}
                    onChange={(e) => setOnlyOrganic(e.target.checked)}
                    className="rounded text-leaf-500 focus:ring-leaf-400 h-4 w-4"
                  />
                  <span>100% Certified Organic Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-forest-900 font-medium">
                  <input
                    type="checkbox"
                    checked={onlySeasonal}
                    onChange={(e) => setOnlySeasonal(e.target.checked)}
                    className="rounded text-harvest-amber focus:ring-harvest-amber h-4 w-4"
                  />
                  <span>Seasonal Specials Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {/* Prominent Category Quick-Switch Tabs */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
              {categories.map((cat) => {
                const active = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-forest-900 text-white shadow-md ring-2 ring-forest-900/30'
                        : 'bg-white text-forest-900 border border-cream-200 hover:border-leaf-400 hover:bg-leaf-50/70 shadow-2xs'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-cream-100 text-forest-700'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Header info bar */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-cream-200 text-xs text-forest-700/70">
              <span>
                Showing <strong>{filteredProducts.length}</strong> farm-fresh product{filteredProducts.length !== 1 ? 's' : ''}
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-leaf-600 hover:text-leaf-700 font-semibold underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center border border-cream-200 shadow-2xs">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-50 text-leaf-500 mx-auto mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-forest-950">
                  No products matched your filters
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-forest-700/70 max-w-sm mx-auto leading-relaxed">
                  Try adjusting your search query, increasing the price range, or clearing category filters to see today&apos;s harvest.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-forest-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-forest-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-forest-950/60 backdrop-blur-sm"
            />
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-screen max-w-xs bg-cream-50 shadow-2xl flex flex-col p-6 overflow-y-auto"
              >
                <div className="flex items-center justify-between pb-4 border-b border-cream-200">
                  <h3 className="font-serif text-xl font-bold text-forest-950">Filters</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-forest-700/70 hover:text-forest-950"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="py-5 space-y-6">
                  {/* Category */}
                  <div>
                    <h4 className="text-xs font-bold uppercase text-forest-700/70 mb-2">Category</h4>
                    <div className="space-y-1">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => {
                            setCategory(cat.value);
                            setMobileFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                            category === cat.value
                              ? 'bg-leaf-500 text-white font-semibold'
                              : 'bg-white text-forest-900 border border-cream-200'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Max Price:</span>
                      <strong>₹{maxPrice}</strong>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="300"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-leaf-500"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={onlyInStock}
                        onChange={(e) => setOnlyInStock(e.target.checked)}
                      />
                      <span>In-Stock Only</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={onlyOrganic}
                        onChange={(e) => setOnlyOrganic(e.target.checked)}
                      />
                      <span>100% Certified Organic</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={onlySeasonal}
                        onChange={(e) => setOnlySeasonal(e.target.checked)}
                      />
                      <span>Seasonal Specials Only</span>
                    </label>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-cream-200 flex gap-2">
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-2.5 rounded-xl border border-cream-300 text-xs font-semibold text-forest-900"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-leaf-500 text-white text-xs font-semibold"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
