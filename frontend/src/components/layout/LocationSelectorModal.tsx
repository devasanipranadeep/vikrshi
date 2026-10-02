'use client';

import React, { useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapPin, Check, Search, X, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LocationSelectorModal() {
  const { isSelectorOpen, closeLocationSelector, locations, selectedLocation, setSelectedLocation } =
    useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isSelectorOpen) return null;

  const filteredLocations = locations.filter(
    (loc) =>
      loc.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.deliveryAreas?.some((area) => area.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (loc.pincodes && loc.pincodes.some((pin) => pin.includes(searchQuery)))
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLocationSelector}
          className="fixed inset-0 bg-forest-950/70 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.35 }}
          className="relative z-10 w-full max-w-xl rounded-2xl bg-cream-50 p-6 md:p-8 shadow-2xl border border-leaf-100"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-cream-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-500/10 text-leaf-500">
                  <MapPin className="h-4 w-4" />
                </span>
                <h3 className="font-serif text-2xl font-bold text-forest-900">
                  Select Delivery Location
                </h3>
              </div>
              <p className="mt-1 text-sm text-forest-700/80">
                Produce is harvested fresh daily and dispatched directly to your city.
              </p>
            </div>
            <button
              onClick={closeLocationSelector}
              className="rounded-full p-2 text-forest-900/60 hover:bg-cream-200 hover:text-forest-900 transition-colors"
              aria-label="Close location selector"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mt-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-700/60" />
            <input
              type="text"
              placeholder="Search by city, area (e.g. Jubilee Hills, Gachibowli), or pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white border border-cream-300 py-2.5 pl-10 pr-4 text-sm text-forest-900 placeholder:text-forest-700/50 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
            />
          </div>

          {/* Locations list */}
          <div className="mt-5 max-h-[340px] space-y-3 overflow-y-auto pr-1">
            {filteredLocations.length === 0 ? (
              <div className="py-8 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-leaf-500/60 mb-2" />
                <p className="text-sm font-medium text-forest-900">No matching areas found</p>
                <p className="text-xs text-forest-700/70 mt-1">
                  We are expanding rapidly across Telangana and South India. Contact us on WhatsApp for custom farm delivery requests!
                </p>
              </div>
            ) : (
              filteredLocations.map((loc) => {
                const isSelected = selectedLocation.toLowerCase() === loc.cityName.toLowerCase();
                return (
                  <div
                    key={loc.id}
                    onClick={() => {
                      if (loc.isActive) {
                        setSelectedLocation(loc.cityName);
                      }
                    }}
                    className={`relative rounded-xl border p-4 transition-all ${
                      loc.isActive
                        ? isSelected
                          ? 'border-leaf-500 bg-leaf-50/70 shadow-sm cursor-pointer'
                          : 'border-cream-200 bg-white hover:border-leaf-300 hover:bg-leaf-50/30 cursor-pointer'
                        : 'border-cream-200 bg-cream-100/60 opacity-80 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif text-lg font-bold text-forest-900">
                            {loc.cityName}
                          </span>
                          <span className="text-xs text-forest-700/70">({loc.state})</span>

                          {loc.isActive ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-leaf-500/10 px-2.5 py-0.5 text-xs font-semibold text-leaf-600">
                              <Clock className="h-3 w-3" />
                              {loc.deliveryAvailability}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-harvest-amber/15 px-2.5 py-0.5 text-xs font-semibold text-harvest-coral">
                              <Sparkles className="h-3 w-3" />
                              Upcoming Hub
                            </span>
                          )}
                        </div>

                        {/* Covered Areas Preview */}
                        {loc.deliveryAreas.length > 0 && (
                          <p className="mt-1.5 text-xs text-forest-700/80 leading-relaxed">
                            <span className="font-medium text-forest-900">Coverage: </span>
                            {loc.deliveryAreas.slice(0, 6).join(', ')}
                            {loc.deliveryAreas.length > 6 && ` +${loc.deliveryAreas.length - 6} more`}
                          </p>
                        )}
                      </div>

                      {/* Selection Checkmark */}
                      {loc.isActive && (
                        <div
                          className={`ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            isSelected
                              ? 'border-leaf-500 bg-leaf-500 text-white'
                              : 'border-cream-300 bg-cream-50'
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-cream-200 text-xs text-forest-700/80">
            <span>Currently selected: <strong className="text-leaf-600">{selectedLocation}</strong></span>
            <button
              onClick={closeLocationSelector}
              className="font-medium text-leaf-500 hover:text-leaf-600 underline"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
