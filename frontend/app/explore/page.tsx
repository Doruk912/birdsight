"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { MapObservation } from "@/app/types/explore";
import { MAP_OBSERVATIONS } from "@/app/constants/mapObservations";
import MapSidebar from "@/app/components/explore/MapSidebar";
import "./explore.css";

// Dynamic import to avoid SSR issues with MapLibre
const ObservationMap = dynamic(
  () => import("@/app/components/explore/ObservationMap"),
  { ssr: false }
);

export default function ExplorePage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelectObservation = useCallback(
    (obs: MapObservation | null) => {
      setSelectedId(obs?.id ?? null);
    },
    []
  );

  const handleSidebarSelect = useCallback(
    (obs: MapObservation) => {
      setSelectedId(obs.id);
      // Trigger fly-to via a custom event dispatched to the map
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
      {/* Map — fills entire viewport below navbar */}
      <ObservationMap
        observations={MAP_OBSERVATIONS}
        selectedId={selectedId}
        onSelectObservation={handleSelectObservation}
      />

      {/* Sidebar overlays on top of the map */}
      <MapSidebar
        observations={MAP_OBSERVATIONS}
        selectedId={selectedId}
        onSelectObservation={handleSidebarSelect}
      />
    </div>
  );
}
