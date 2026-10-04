'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { OrderInquiriesManager } from '@/components/admin/OrderInquiriesManager';
import { OrderInquiryRecord } from '@/types';
import { orderService } from '@/services/orders';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<OrderInquiryRecord[]>([]);

  const loadData = async () => {
    try {
      const data = await orderService.getOrderInquiries();
      setInquiries(data || []);
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
    <AdminWrapper activeTab="inquiries">
      <OrderInquiriesManager
        inquiries={inquiries}
        onInquiryUpdated={loadData}
      />
    </AdminWrapper>
  );
}
