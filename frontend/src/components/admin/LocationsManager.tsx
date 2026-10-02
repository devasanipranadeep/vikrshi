'use client';

import React, { useState } from 'react';
import { LocationItem } from '@/types';
import {
  createLocationAction,
  updateLocationAction,
  deleteLocationAction,
} from '@/actions/locations';
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Phone,
  Clock,
  Loader2,
  X,
  Navigation,
} from 'lucide-react';
import { toast } from 'sonner';
import { notifyStoreUpdate } from '@/utils/storeEvents';

interface LocationsManagerProps {
  locations: LocationItem[];
  onLocationUpdated: () => void;
}

export function LocationsManager({ locations, onLocationUpdated }: LocationsManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<LocationItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [city, setCity] = useState('');
  const [state, setState] = useState('Telangana');
  const [country, setCountry] = useState('India');
  const [slug, setSlug] = useState('');
  const [address, setAddress] = useState('');
  const [serviceAreasInput, setServiceAreasInput] = useState('');
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const openAddModal = () => {
    setEditingLoc(null);
    setCity('');
    setState('Telangana');
    setCountry('India');
    setSlug('');
    setAddress('');
    setServiceAreasInput('Central Hub, North Zone, South Zone');
    setDeliveryAvailable(true);
    setWhatsappNumber('919490123456');
    setLatitude('');
    setLongitude('');
    setIsActive(true);
    setSortOrder(locations.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (loc: LocationItem) => {
    setEditingLoc(loc);
    setCity(loc.cityName);
    setState(loc.state);
    setCountry(loc.country || 'India');
    setSlug(loc.slug);
    setAddress(loc.address || loc.hubAddress || '');
    setServiceAreasInput(loc.deliveryAreas ? loc.deliveryAreas.join(', ') : '');
    setDeliveryAvailable(loc.deliveryAvailable !== false);
    setWhatsappNumber(loc.whatsappNumber || '');
    setLatitude(loc.latitude ? String(loc.latitude) : '');
    setLongitude(loc.longitude ? String(loc.longitude) : '');
    setIsActive(loc.isActive);
    setSortOrder(loc.sortOrder ?? 0);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !state.trim()) {
      toast.error('City and State are required');
      return;
    }

    const areas = serviceAreasInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      if (editingLoc) {
        const res = await updateLocationAction(editingLoc.id, {
          city,
          state,
          country,
          slug: slug || undefined,
          address,
          serviceAreas: areas,
          deliveryAvailable,
          whatsappNumber: whatsappNumber || null,
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
          isActive,
          sortOrder: Number(sortOrder),
        });

        if (res.success) {
          toast.success(`Location "${city}" updated`);
          notifyStoreUpdate('locations');
          setIsModalOpen(false);
          onLocationUpdated();
        } else {
          toast.error(res.error || 'Failed to update location');
        }
      } else {
        const res = await createLocationAction({
          city,
          state,
          country,
          slug: slug || undefined,
          address,
          serviceAreas: areas,
          deliveryAvailable,
          whatsappNumber: whatsappNumber || null,
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
          isActive,
          sortOrder: Number(sortOrder),
        });

        if (res.success) {
          toast.success(`New service location "${city}" added!`);
          notifyStoreUpdate('locations');
          setIsModalOpen(false);
          onLocationUpdated();
        } else {
          toast.error(res.error || 'Failed to create location');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (loc: LocationItem) => {
    try {
      const res = await updateLocationAction(loc.id, {
        isActive: !loc.isActive,
      });
      if (res.success) {
        toast.success(`${loc.cityName} is now ${!loc.isActive ? 'Active' : 'Deactivated'}`);
        notifyStoreUpdate('locations');
        onLocationUpdated();
      } else {
        toast.error('Failed to toggle status');
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (loc: LocationItem) => {
    if (loc.slug === 'hyderabad') {
      toast.error('Hyderabad is the primary anchor location and cannot be deleted.');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove ${loc.cityName} from Vikrshi locations?`)) {
      return;
    }

    try {
      const res = await deleteLocationAction(loc.id);
      if (res.success) {
        toast.success(`Location ${loc.cityName} deleted`);
        notifyStoreUpdate('locations');
        onLocationUpdated();
      } else {
        toast.error(res.error || 'Failed to delete');
      }
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-forest-950">Delivery Hubs & Cities</h2>
          <p className="text-xs text-forest-600 mt-0.5">
            Add unlimited cities dynamically (e.g. Hyderabad, Bengaluru, Pune, Mumbai, Chennai)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New City</span>
        </button>
      </div>

      {/* Grid of locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white rounded-2xl border border-cream-200 p-5 shadow-xs hover:border-leaf-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-forest-950 flex items-center gap-2">
                    <span>{loc.cityName}</span>
                    <span className="text-xs font-normal text-forest-500">({loc.state})</span>
                  </h3>
                  <span className="text-[11px] font-mono text-leaf-600">/{loc.slug}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {loc.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-leaf-100 text-leaf-800 text-[10px] font-bold">
                      <CheckCircle className="w-3 h-3 text-leaf-600" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold">
                      <XCircle className="w-3 h-3 text-stone-500" /> Inactive
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-forest-700 pt-1">
                {loc.address && (
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-leaf-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{loc.address}</span>
                  </p>
                )}

                {loc.whatsappNumber && (
                  <p className="flex items-center gap-1.5 font-medium text-emerald-800">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>WhatsApp: +{loc.whatsappNumber}</span>
                  </p>
                )}

                <div className="pt-2">
                  <span className="text-[10px] text-forest-500 uppercase tracking-wider block mb-1">
                    Service Areas ({loc.deliveryAreas?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {loc.deliveryAreas?.slice(0, 4).map((area, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-cream-100 text-[11px] text-forest-800"
                      >
                        {area}
                      </span>
                    ))}
                    {(loc.deliveryAreas?.length || 0) > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-cream-100 text-[11px] text-forest-500">
                        +{(loc.deliveryAreas?.length || 0) - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-cream-200 flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(loc)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  loc.isActive
                    ? 'text-stone-600 hover:bg-stone-100'
                    : 'text-leaf-700 hover:bg-leaf-100'
                }`}
              >
                {loc.isActive ? 'Deactivate' : 'Activate'}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(loc)}
                  className="p-1.5 rounded-lg text-forest-600 hover:text-leaf-600 hover:bg-cream-100 transition-colors"
                  title="Edit location"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(loc)}
                  className="p-1.5 rounded-lg text-forest-400 hover:text-red-600 hover:bg-cream-100 transition-colors"
                  title="Delete location"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-forest-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-cream-200 my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200 mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-forest-950">
                  {editingLoc ? 'Edit Service Location' : 'Add New Service City'}
                </h3>
                <p className="text-xs text-forest-600">
                  Instantly available to public customers on the storefront
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-forest-400 hover:text-forest-900 hover:bg-cream-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    City Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Karnataka"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    URL Slug (auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. bengaluru"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    City WhatsApp Number (optional)
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g. 919490123456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Local Hub Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Vikrshi Hub, Indiranagar, Bengaluru..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 mb-1">
                  Service Neighborhoods / Areas (comma separated)
                </label>
                <input
                  type="text"
                  value={serviceAreasInput}
                  onChange={(e) => setServiceAreasInput(e.target.value)}
                  placeholder="Koramangala, Whitefield, Indiranagar, HSR Layout"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="12.971599"
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-forest-900 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="77.594566"
                    className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs text-forest-900 focus:outline-none focus:border-leaf-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliveryAvailable}
                    onChange={(e) => setDeliveryAvailable(e.target.checked)}
                    className="rounded border-cream-300 text-leaf-600 focus:ring-leaf-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-forest-900">
                    Delivery Available
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-cream-300 text-leaf-600 focus:ring-leaf-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-forest-900">Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-cream-300 text-xs font-semibold text-forest-700 hover:bg-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-leaf-600 hover:bg-leaf-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingLoc ? 'Save Location' : 'Add Location'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
