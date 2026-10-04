'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { OrdersManager } from '@/components/admin/OrdersManager';
import { OrderInquiryRecord } from '@/types';
import { orderService } from '@/services/orders';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';

export default function AdminOrdersPage() {
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
    <AdminWrapper activeTab="orders">
      <OrdersManager
        inquiries={inquiries}
        onInquiryUpdated={loadData}
      />
    </AdminWrapper>
  );
}
