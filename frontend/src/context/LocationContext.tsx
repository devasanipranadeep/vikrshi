'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LocationItem } from '@/types';
import { locationService } from '@/services/locationService';
import { subscribeToStoreUpdates } from '@/utils/storeEvents';
import { toast } from 'sonner';

interface LocationContextType {
  selectedLocation: string;
  locations: LocationItem[];
  activeLocations: LocationItem[];
  currentLocationDetails?: LocationItem;
  isLoading: boolean;
  isSelectorOpen: boolean;
  setSelectedLocation: (cityName: string) => void;
  openLocationSelector: () => void;
  closeLocationSelector: () => void;
  toggleLocationSelector: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCATION_STORAGE_KEY = 'vikrshi_user_location_pref';

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocation, setSelectedLocationState] = useState<string>('Hyderabad');
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Load locations dynamically from backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchLocations() {
      try {
        const data = await locationService.getLocations();
        if (isMounted) {
          setLocations(data || []);
        }
      } catch (err) {
        console.error('Failed fetching dynamic locations', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchLocations();

    const unsubscribe = subscribeToStoreUpdates(() => {
      fetchLocations();
    }, ['locations', 'all']);

    // Load saved location preference
    try {
      const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (saved) {
        setSelectedLocationState(saved);
      }
    } catch (e) {
      console.warn('Could not read location preference', e);
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const setSelectedLocation = (cityName: string) => {
    setSelectedLocationState(cityName);
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, cityName);
    } catch (e) {
      console.warn('Could not save location preference', e);
    }
    setIsSelectorOpen(false);
    toast.success(`Delivery location updated to ${cityName}`);
  };

  const activeLocations = locations.filter((l) => l.isActive);
  const currentLocationDetails = locations.find(
    (l) => l.cityName.toLowerCase() === selectedLocation.toLowerCase()
  );

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        locations,
        activeLocations,
        currentLocationDetails,
        isLoading,
        isSelectorOpen,
        setSelectedLocation,
        openLocationSelector: () => setIsSelectorOpen(true),
        closeLocationSelector: () => setIsSelectorOpen(false),
        toggleLocationSelector: () => setIsSelectorOpen((prev) => !prev),
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
