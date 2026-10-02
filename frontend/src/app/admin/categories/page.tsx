'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { CategoriesManager } from '@/components/admin/CategoriesManager';
import { Category } from '@/types';
import { categoryService } from '@/services/categories';
import { initialCategories } from '@/constants/mockData';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const loadData = async () => {
    try {
      const data = await categoryService.getCategories(true);
      if (data?.length) setCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminWrapper activeTab="categories">
      <CategoriesManager
        categories={categories}
        onCategoryUpdated={loadData}
      />
    </AdminWrapper>
  );
}
