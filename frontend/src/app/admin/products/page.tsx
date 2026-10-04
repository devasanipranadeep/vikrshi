'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { ProductsManager } from '@/components/admin/ProductsManager';
import { Product, LocationItem, Category } from '@/types';
import { productService } from '@/services/products';
import { locationService } from '@/services/locations';
import { categoryService } from '@/services/categories';
import { initialProducts, initialCategories } from '@/constants/mockData';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [locations, setLocations] = useState<LocationItem[]>([]);

  const loadData = async () => {
    try {
      const [prods, cats, locs] = await Promise.all([
        productService.getProducts({ includeInactive: true }),
        categoryService.getCategories(true),
        locationService.getLocations(true),
      ]);
      if (prods) setProducts(prods);
      if (cats) setCategories(cats);
      if (locs) setLocations(locs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = subscribeToStoreUpdates(() => loadData());
    return () => unsub();
  }, []);

  return (
    <AdminWrapper activeTab="products">
      <ProductsManager
        products={products}
        categories={categories}
        locations={locations}
        onProductUpdated={loadData}
      />
    </AdminWrapper>
  );
}
