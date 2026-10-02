'use client';

import React from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { SocialManager } from '@/components/admin/SocialManager';

export default function AdminSocialPage() {
  return (
    <AdminWrapper activeTab="social">
      <SocialManager />
    </AdminWrapper>
  );
}
