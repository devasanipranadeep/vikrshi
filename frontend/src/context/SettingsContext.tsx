'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CompanySettings } from '@/types';
import { initialCompanySettings } from '@/constants/mockData';

interface SettingsContextType {
  settings: CompanySettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings] = useState<CompanySettings>(initialCompanySettings);

  const refreshSettings = useCallback(async () => {
    // Constant settings do not require network refetching
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading: false, refreshSettings }}>
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
