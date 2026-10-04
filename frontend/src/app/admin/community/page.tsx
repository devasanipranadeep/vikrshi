'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { CommunityRequestsManager } from '@/components/admin/CommunityRequestsManager';
import { CommunityRequestItem } from '@/types';
import { communityService } from '@/services/community';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';

export default function AdminCommunityPage() {
  const [requests, setRequests] = useState<CommunityRequestItem[]>([]);

  const loadData = async () => {
    try {
      const data = await communityService.getCommunityRequests();
      setRequests(data || []);
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
    <AdminWrapper activeTab="community">
      <CommunityRequestsManager
        requests={requests}
        onRequestUpdated={loadData}
      />
    </AdminWrapper>
  );
}
