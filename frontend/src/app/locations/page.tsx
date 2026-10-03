'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LocationItem } from '@/types';
import { locationService } from '@/services/locationService';
import { initialLocations } from '@/constants/mockData';
import { useLocation } from '@/context/LocationContext';
import { useSettings } from '@/context/SettingsContext';
import { buildGeneralWhatsAppUrl } from '@/utils/whatsapp';
import {
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Truck,
  Phone,
  MessageCircle,
  Building,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>(initialLocations);
  const [pincodeQuery, setPincodeQuery] = useState('');
  const [checkResult, setCheckResult] = useState<{
    searched: boolean;
    available: boolean;
    locationName?: string;
    details?: string;
  } | null>(null);

  const { selectedLocation, setSelectedLocation } = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    locationService.getLocations().then((data) => {
      if (data && data.length > 0) {
        setLocations(data);
      }
    });
  }, []);

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    const query = pincodeQuery.trim().toLowerCase();
    if (!query) return;

    const matched = locations.find(
      (loc) =>
        loc.isActive &&
        ((loc.pincodes && loc.pincodes.some((pin) => pin.includes(query))) ||
          loc.deliveryAreas?.some((area) => area.toLowerCase().includes(query)) ||
          loc.cityName.toLowerCase().includes(query))
    );

    if (matched) {
      setCheckResult({
        searched: true,
        available: true,
        locationName: matched.cityName,
        details: `${matched.deliveryAvailability} is fully operational in ${matched.cityName}. Morning delivery slots start at 6:30 AM!`,
      });
      toast.success(`Great news! We deliver to ${matched.cityName}`);
    } else {
      setCheckResult({
        searched: true,
        available: false,
        details: `We are not yet running regular morning slots for "${pincodeQuery}", but we accommodate custom bulk farm dispatches upon WhatsApp request!`,
      });
      toast.info('Coverage expanding soon to your area');
    }
  };

  const activeLocations = locations.filter((l) => l.isActive);
  const upcomingLocations = locations.filter((l) => !l.isActive);

  return (
    <div className="pt-24 pb-20 bg-cream-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="rounded-3xl bg-forest-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden mb-12 border border-leaf-500/20">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-leaf-300 bg-leaf-500/20 px-3.5 py-1 rounded-full inline-block border border-leaf-400/30">
              Service Operations Hub
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Farm Dispatch Locations
            </h1>
            <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed">
              We operate hyper-local cold-chain sorting depots to ensure harvest reaches your kitchen within hours of leaving the ground. We are currently operational in Telangana and expanding to major South Indian cities.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-leaf-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Pincode / Area Checker Card */}
        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-cream-200 shadow-sm max-w-2xl mx-auto mb-16">
          <div className="text-center mb-5">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-950">
              Check Delivery in Your Neighborhood
            </h2>
            <p className="text-xs text-forest-700/80 mt-1">
              Enter your Hyderabad pincode (e.g. 500033) or colony / area (e.g. Jubilee Hills, Gachibowli)
            </p>
          </div>

          <form onSubmit={handleCheckDelivery} className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-700/60" />
              <input
                type="text"
                placeholder="Enter 6-digit pincode or area name..."
                value={pincodeQuery}
                onChange={(e) => setPincodeQuery(e.target.value)}
                className="w-full rounded-xl bg-cream-50 border border-cream-300 py-3 pl-10 pr-4 text-xs sm:text-sm text-forest-950 focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-leaf-500 hover:bg-leaf-600 text-white font-semibold px-5 py-3 text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
            >
              Check
            </button>
          </form>

          {/* Result Alert */}
          {checkResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 rounded-xl p-4 text-xs sm:text-sm ${
                checkResult.available
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {checkResult.available ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold">
                    {checkResult.available
                      ? `Delivering to ${checkResult.locationName}!`
                      : 'Delivery Area Request'}
                  </h4>
                  <p className="mt-0.5 text-xs leading-relaxed opacity-90">
                    {checkResult.details}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Active Locations List */}
        <div className="space-y-6 mb-16">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-leaf-600">
                Operational Depots
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest-950">
                Active Service Cities
              </h2>
            </div>
          </div>

          {activeLocations.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 border border-cream-200 text-center shadow-2xs">
              <Building className="mx-auto h-8 w-8 text-leaf-500/60 mb-2" />
              <p className="text-sm font-semibold text-forest-900">Service Locations Updating Soon</p>
              <p className="text-xs text-forest-700/70 mt-1 max-w-md mx-auto">
                Our active delivery hubs and service areas are currently being updated. Please contact us via WhatsApp for direct delivery inquiries in your area.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeLocations.map((loc) => {
                const isSelected = selectedLocation.toLowerCase() === loc.cityName.toLowerCase();
                const whatsappChatUrl = buildGeneralWhatsAppUrl({
                  phone: settings.whatsappNumber,
                  companyName: settings.companyName,
                  location: loc.cityName,
                });

                return (
                  <div
                    key={loc.id}
                    className={`rounded-2xl bg-white p-6 border transition-all duration-300 shadow-2xs hover:shadow-xl flex flex-col justify-between ${
                      isSelected ? 'border-leaf-500 ring-2 ring-leaf-500/20' : 'border-cream-200'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-2xl font-bold text-forest-950">
                              {loc.cityName}
                            </h3>
                            <span className="text-xs text-forest-700/70 font-medium">
                              ({loc.state})
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-leaf-500/10 px-2.5 py-0.5 text-xs font-semibold text-leaf-600 mt-1">
                            <Clock className="h-3 w-3" />
                            {loc.deliveryAvailability}
                          </span>
                        </div>

                        {isSelected && (
                          <span className="flex items-center gap-1 rounded-full bg-leaf-500 text-white text-[11px] font-bold px-2 py-0.5">
                            <Check className="h-3 w-3" />
                            Selected
                          </span>
                        )}
                      </div>

                      {/* Depot Hub details */}
                      <div className="space-y-2 text-xs text-forest-700/80 pt-2 border-t border-cream-100">
                        <div className="flex items-start gap-2">
                          <Building className="h-3.5 w-3.5 text-leaf-500 shrink-0 mt-0.5" />
                          <span>
                            {loc.isDefault || loc.cityName.toLowerCase() === 'hyderabad' || loc.hubAddress?.includes('Chevella') || loc.hubAddress?.includes('Shamshabad')
                              ? (settings.address?.fullText || 'H-No. 2-41/1, Zapthi Singaipalli, Cheelasagar, Mulugu Mandal, Siddipet, Telangana 502279-India.')
                              : (loc.hubAddress || loc.address)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-leaf-500 shrink-0" />
                          <span>Hours: {loc.operatingHours}</span>
                        </div>
                      </div>

                      {/* Coverage Areas */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-forest-700/70 mb-2">
                          Key Coverage Neighborhoods:
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {loc.deliveryAreas.map((area) => (
                            <span
                              key={area}
                              className="rounded-lg bg-cream-100 px-2 py-0.5 text-[11px] text-forest-800"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t border-cream-100 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedLocation(loc.cityName)}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'bg-leaf-100 text-leaf-700'
                            : 'bg-forest-900 hover:bg-forest-800 text-white'
                        }`}
                      >
                        {isSelected ? 'Default Location' : 'Set as Delivery City'}
                      </button>
                      <a
                        href={whatsappChatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors"
                        title="Inquire via WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Locations */}
        {upcomingLocations.length > 0 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-harvest-coral">
                Expansion Roadmap
              </span>
              <h2 className="font-serif text-2xl font-bold text-forest-950">
                Upcoming Delivery Clusters
              </h2>
              <p className="text-xs text-forest-700/70 mt-1">
                We are currently auditing soil quality and onboarding organic smallholder farmer networks in these regions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingLocations.map((loc) => (
                <div
                  key={loc.id}
                  className="rounded-2xl bg-white/70 p-6 border border-cream-200/80 shadow-2xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl font-bold text-forest-900">
                        {loc.cityName}
                      </h3>
                      <span className="text-xs text-forest-700/70">({loc.state})</span>
                    </div>
                    <p className="text-xs text-forest-700/80 mt-1">
                      Target Areas: {loc.deliveryAreas.join(', ')}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-harvest-amber/15 px-3 py-1 text-xs font-semibold text-harvest-coral">
                    <Sparkles className="h-3 w-3" />
                    Launching Soon
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
