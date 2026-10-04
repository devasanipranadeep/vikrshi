'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CompanySettings } from '@/types';
import { settingsService } from '@/services/settingsService';
import { initialCompanySettings } from '@/constants/mockData';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';

interface SettingsContextType {
  settings: CompanySettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<CompanySettings>(initialCompanySettings);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    try {
      // 1. Fetch fresh company settings from public API (no-store)
      const res = await fetch('/api/settings/public', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSettings(json.data);
          return;
        }
      }

      // 2. Fallback to Supabase client
      const data = await settingsService.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.warn('Failed loading backend settings, falling back to client service', err);
      try {
        const data = await settingsService.getSettings();
        if (data) setSettings(data);
      } catch {}
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();

    // Subscribe to instant cross-tab updates, Supabase realtime events, and tab focus
    const unsubscribe = subscribeToStoreUpdates(() => {
      loadSettings();
    }, ['settings', 'all']);

    return () => {
      unsubscribe();
    };
  }, [loadSettings]);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
