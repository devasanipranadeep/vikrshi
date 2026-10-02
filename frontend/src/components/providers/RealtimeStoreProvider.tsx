'use client';

import React, { useEffect } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { notifyStoreUpdate } from '@/utils/storeEvents';

export function RealtimeStoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let channel: any = null;

    try {
      const client = getBrowserClient();

      // Listen to PostgreSQL database mutations via WebSocket channel
      channel = client
        .channel('vikrshi_live_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          notifyStoreUpdate('products');
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
          notifyStoreUpdate('categories');
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'company_settings' }, () => {
          notifyStoreUpdate('settings');
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, () => {
          notifyStoreUpdate('locations');
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'product_locations' }, () => {
          notifyStoreUpdate('products');
        })
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription could not be established:', e);
    }

    // Periodic heartbeat: check every 25 seconds if tab is active to ensure zero stale data
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        notifyStoreUpdate('all');
      }
    }, 25000);

    return () => {
      clearInterval(interval);
      if (channel) {
        try {
          const client = getBrowserClient();
          client.removeChannel(channel);
        } catch {}
      }
    };
  }, []);

  return <>{children}</>;
}
