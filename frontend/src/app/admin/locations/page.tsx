'use client';

import React, { useState, useEffect } from 'react';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { LocationsManager } from '@/components/admin/LocationsManager';
import { LocationItem } from '@/types';
import { locationService } from '@/services/locations';
import { initialLocations } from '@/constants/mockData';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>(initialLocations);

  const loadData = async () => {
    try {
      const data = await locationService.getLocations(true);
      if (data?.length) setLocations(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminWrapper activeTab="locations">
      <LocationsManager
        locations={locations}
        onLocationUpdated={loadData}
      />
    </AdminWrapper>
  );
}
