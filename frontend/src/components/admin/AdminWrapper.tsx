'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { AdminLayout } from './AdminLayout';
import { AdminLogin } from './AdminLogin';
import { Loader2 } from 'lucide-react';

interface AdminWrapperContentProps {
  activeTab: string;
  children: React.ReactNode;
}

function AdminWrapperContent({ activeTab, children }: AdminWrapperContentProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  const handleSelectTab = (tab: string) => {
    if (tab === 'dashboard') {
      router.push('/admin');
    } else {
      router.push(`/admin/${tab}`);
    }
  };

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
    <AdminLayout activeTab={activeTab} onSelectTab={handleSelectTab}>
      {children}
    </AdminLayout>
  );
}

export function AdminWrapper({ activeTab, children }: AdminWrapperContentProps) {
  return (
    <AdminAuthProvider>
      <AdminWrapperContent activeTab={activeTab}>
        {children}
      </AdminWrapperContent>
    </AdminAuthProvider>
  );
}
