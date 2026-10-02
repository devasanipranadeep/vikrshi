'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { AdminLogin } from '@/components/admin/AdminLogin';

function LoginContent() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  return <AdminLogin />;
}

export default function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <LoginContent />
    </AdminAuthProvider>
  );
}
