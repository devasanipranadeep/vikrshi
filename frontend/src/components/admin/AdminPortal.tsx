'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { DashboardOverview } from './DashboardOverview';
import { ProductsManager } from './ProductsManager';
import { CategoriesManager } from './CategoriesManager';
import { LocationsManager } from './LocationsManager';
import { OrderInquiriesManager } from './OrderInquiriesManager';
import { CommunityRequestsManager } from './CommunityRequestsManager';
import { ReviewsManager } from './ReviewsManager';
import { SocialManager } from './SocialManager';
import { GalleryManager } from './GalleryManager';
import {
  Product,
  Category,
  LocationItem,
  OrderInquiryRecord,
  CommunityRequestItem,
  CustomerReview,
} from '@/types';
import { productService } from '@/services/products';
import { categoryService } from '@/services/categories';
import { locationService } from '@/services/locations';
import { orderService } from '@/services/orders';
import { communityService } from '@/services/community';
import { initialProducts, initialCategories, initialReviews } from '@/constants/mockData';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';
import { Loader2 } from 'lucide-react';

export function AdminPortal() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [inquiries, setInquiries] = useState<OrderInquiryRecord[]>([]);
  const [communityRequests, setCommunityRequests] = useState<CommunityRequestItem[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>(initialReviews);

  // Fetch live store data across Supabase services
  const loadData = async () => {
    try {
      const [
        prods,
        cats,
        locs,
        inqs,
        comms,
      ] = await Promise.allSettled([
        productService.getProducts({ includeInactive: true }),
        categoryService.getCategories(true),
        locationService.getLocations(true),
        orderService.getOrderInquiries(),
        communityService.getCommunityRequests(),
      ]);

      if (prods.status === 'fulfilled' && prods.value) setProducts(prods.value);
      if (cats.status === 'fulfilled' && cats.value) setCategories(cats.value);
      if (locs.status === 'fulfilled' && locs.value) setLocations(locs.value);
      if (inqs.status === 'fulfilled') setInquiries(inqs.value || []);
      if (comms.status === 'fulfilled') setCommunityRequests(comms.value || []);

      // Reviews endpoint fallback
      try {
        const revRes = await fetch('/api/reviews').then((r) => r.json());
        if (revRes?.data?.reviews) setReviews(revRes.data.reviews);
      } catch {}
    } catch (e) {
      console.error('Error loading Supabase admin data', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const unsubscribe = subscribeToStoreUpdates(() => {
        loadData();
      });
      return () => unsubscribe();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-forest-950 flex flex-col items-center justify-center text-white gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-leaf-400" />
        <span className="text-xs text-cream-200/80">Verifying Admin Session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <DashboardOverview
          products={products}
          locations={locations}
          inquiries={inquiries}
          communityRequests={communityRequests}
          reviews={reviews}
          onNavigateTab={setActiveTab}
        />
      )}

      {activeTab === 'products' && (
        <ProductsManager
          products={products}
          categories={categories}
          locations={locations}
          onProductUpdated={loadData}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesManager
          categories={categories}
          onCategoryUpdated={loadData}
        />
      )}

      {activeTab === 'locations' && (
        <LocationsManager
          locations={locations}
          onLocationUpdated={loadData}
        />
      )}

      {activeTab === 'inquiries' && (
        <OrderInquiriesManager
          inquiries={inquiries}
          onInquiryUpdated={loadData}
        />
      )}

      {activeTab === 'community' && (
        <CommunityRequestsManager
          requests={communityRequests}
          onRequestUpdated={loadData}
        />
      )}

      {activeTab === 'reviews' && (
        <ReviewsManager
          reviews={reviews}
          onReviewUpdated={loadData}
        />
      )}

      {activeTab === 'gallery' && (
        <GalleryManager />
      )}

      {activeTab === 'social' && (
        <SocialManager />
      )}
    </AdminLayout>
  );
}
