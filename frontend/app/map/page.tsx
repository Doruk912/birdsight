"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapObservation, ObservationFilterParams } from "@/app/types/explore";
import { fetchMapObservations } from "@/app/lib/observationService";
import MapSidebar from "@/app/components/explore/MapSidebar";
import "./map.css";

// Dynamic import to avoid SSR issues with MapLibre
const ObservationMap = dynamic(
  () => import("@/app/components/explore/ObservationMap"),
  { ssr: false },
);

export default function ExplorePage() {
  const [observations, setObservations] = useState<MapObservation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Active filters = what is currently applied
  const [filters, setFilters] = useState<ObservationFilterParams>({});
  // Pending filters = what the user is editing (not yet applied)
  const [pendingFilters, setPendingFilters] = useState<ObservationFilterParams>(
    {},
  );

  // Fetch observations whenever active filters change
  useEffect(() => {
    setLoading(true);
    fetchMapObservations(filters)
      .then((data) => {
        setObservations(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters]);

  const handleSelectObservation = useCallback((obs: MapObservation | null) => {
    setSelectedId(obs?.id ?? null);
  }, []);

  const handleSidebarSelect = useCallback((obs: MapObservation) => {
    setSelectedId(obs.id);
    window.dispatchEvent(
      new CustomEvent("birdsight:flyto", {
        detail: { longitude: obs.longitude, latitude: obs.latitude },
      }),
    );
  }, []);

  // Apply pending filters → become active filters
  const handleApplyFilters = useCallback(() => {
    setFilters({ ...pendingFilters });
  }, [pendingFilters]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setPendingFilters({});
    setFilters({});
  }, []);

  // Bounding box from map drawing
  const handleBoundingBoxDraw = useCallback(
    (
      bounds: {
        swLat: number;
        swLng: number;
        neLat: number;
        neLng: number;
      } | null,
    ) => {
      if (bounds) {
        const updated = {
          ...pendingFilters,
          swLat: bounds.swLat,
          swLng: bounds.swLng,
          neLat: bounds.neLat,
          neLng: bounds.neLng,
        };
        setPendingFilters(updated);
        // Auto-apply when a bounding box is drawn
        setFilters(updated);
      } else {
        const { swLat, swLng, neLat, neLng, ...rest } = pendingFilters;
        setPendingFilters(rest);
        setFilters(rest);
      }
    },
    [pendingFilters],
  );

  return (
    <div className="fixed inset-0 top-16 bg-stone-50">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm pointer-events-none">
          <div className="flex items-center gap-3 text-stone-500">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm font-medium">Loading observations…</span>
          </div>
        </div>
      )}

      {/* Map — fills entire viewport below navbar */}
      <ObservationMap
        observations={observations}
        selectedId={selectedId}
        onSelectObservation={handleSelectObservation}
        onBoundingBoxDraw={handleBoundingBoxDraw}
      />

      {/* Sidebar overlays on top of the map */}
      <MapSidebar
        observations={observations}
        selectedId={selectedId}
        onSelectObservation={handleSidebarSelect}
        pendingFilters={pendingFilters}
        onPendingFiltersChange={setPendingFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        loading={loading}
      />
    </div>
  );
}
