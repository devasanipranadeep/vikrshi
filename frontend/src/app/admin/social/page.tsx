'use client';

import React from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { GalleryManager } from '@/components/admin/GalleryManager';

export default function AdminSocialPage() {
  return (
    <AdminWrapper activeTab="social">
      <GalleryManager />
    </AdminWrapper>
  );
}
