import { Metadata } from 'next';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { AdminPortal } from '@/components/admin/AdminPortal';

export const metadata: Metadata = {
  title: 'Vikrshi Admin Portal | Vikrshi Suppliers Pvt Ltd',
  description: 'Internal operations, inventory, and WhatsApp order management for Vikrshi Suppliers Pvt Ltd.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <AdminAuthProvider>
      <AdminPortal />
    </AdminAuthProvider>
  );
}
