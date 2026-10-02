'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { SettingsManager } from '@/components/admin/SettingsManager';
import { CompanySettings } from '@/types';
import { settingsService } from '@/services/settings';
import { initialCompanySettings } from '@/constants/mockData';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>(initialCompanySettings);

  const loadData = async () => {
    try {
      const data = await settingsService.getCompanySettings();
      if (data) setSettings(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminWrapper activeTab="settings">
      <SettingsManager
        settings={settings}
        onSettingsUpdated={loadData}
      />
    </AdminWrapper>
  );
}
