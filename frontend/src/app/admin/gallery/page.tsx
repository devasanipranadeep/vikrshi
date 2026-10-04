'use client';

import React from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { GalleryManager } from '@/components/admin/GalleryManager';

export default function AdminGalleryPage() {
  return (
    <AdminWrapper activeTab="gallery">
      <GalleryManager />
    </AdminWrapper>
  );
}
