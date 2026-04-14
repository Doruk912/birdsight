"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { MapObservation, ObservationFilterParams } from "@/app/types/explore";
import { fetchMapObservations } from "@/app/lib/observationService";
import MapSidebar from "@/app/components/explore/MapSidebar";
import "./map.css";

// Dynamic import to avoid SSR issues with MapLibre
const ObservationMap = dynamic(
  () => import("@/app/components/explore/ObservationMap"),
  { ssr: false }
);

export default function ExplorePage() {
  const [observations, setObservations] = useState<MapObservation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters (shared between sidebar and map)
  const [filters, setFilters] = useState<ObservationFilterParams>({});
  const [bounds, setBounds] = useState<{
    swLat: number;
    swLng: number;
    neLat: number;
    neLng: number;
  } | null>(null);

  // Debounce timer ref
  const boundsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle viewport bounds change from the map (debounced)
  const handleBoundsChange = useCallback(
    (newBounds: {
      swLat: number;
      swLng: number;
      neLat: number;
      neLng: number;
    }) => {
      if (boundsTimerRef.current) {
        clearTimeout(boundsTimerRef.current);
      }
      boundsTimerRef.current = setTimeout(() => {
        setBounds(newBounds);
      }, 600);
    },
    []
  );

  // Fetch observations whenever filters or bounds change
  useEffect(() => {
    const combinedFilters: ObservationFilterParams = {
      ...filters,
      ...(bounds
        ? {
            swLat: bounds.swLat,
            swLng: bounds.swLng,
            neLat: bounds.neLat,
            neLng: bounds.neLng,
          }
        : {}),
    };

    setLoading(true);
    fetchMapObservations(combinedFilters)
      .then((data) => {
        setObservations(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters, bounds]);

  const handleSelectObservation = useCallback(
    (obs: MapObservation | null) => {
      setSelectedId(obs?.id ?? null);
    },
    []
  );

  const handleSidebarSelect = useCallback(
    (obs: MapObservation) => {
      setSelectedId(obs.id);
      window.dispatchEvent(
        new CustomEvent("birdsight:flyto", {
          detail: { longitude: obs.longitude, latitude: obs.latitude },
        })
      );
    },
    []
  );

  return (
    <div className="fixed inset-0 top-16 bg-stone-50">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-sm">
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
        onBoundsChange={handleBoundsChange}
      />

      {/* Sidebar overlays on top of the map */}
      <MapSidebar
        observations={observations}
        selectedId={selectedId}
        onSelectObservation={handleSidebarSelect}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
