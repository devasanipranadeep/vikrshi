'use client';

import React from 'react';
import { SettingsProvider } from '@/context/SettingsContext';
import { LocationProvider } from '@/context/LocationContext';
import { CartProvider } from '@/context/CartContext';
import { RealtimeStoreProvider } from '@/components/providers/RealtimeStoreProvider';
import { Toaster } from 'sonner';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <RealtimeStoreProvider>
      <SettingsProvider>
        <LocationProvider>
          <CartProvider>
            {children}
            <Toaster
              position="bottom-right"
              richColors
              toastOptions={{
                style: {
                  background: '#0F2E1E',
                  color: '#FAF8F5',
                  border: '1px solid #2D6A4F',
                  borderRadius: '12px',
                  fontSize: '14px',
                },
              }}
            />
          </CartProvider>
        </LocationProvider>
      </SettingsProvider>
    </RealtimeStoreProvider>
  );
}
