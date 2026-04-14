"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import MapGL, {
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  MapRef,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapObservation } from "@/app/types/explore";

interface ObservationMapProps {
  observations: MapObservation[];
  selectedId: string | null;
  onSelectObservation: (obs: MapObservation | null) => void;
  onBoundsChange?: (bounds: {
    swLat: number;
    swLng: number;
    neLat: number;
    neLng: number;
  }) => void;
}

const INITIAL_VIEW = {
  longitude: 29.0,
  latitude: 41.0,
  zoom: 10,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

export default function ObservationMap({
  observations,
  selectedId,
  onSelectObservation,
  onBoundsChange,
}: ObservationMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [popupObs, setPopupObs] = useState<MapObservation | null>(null);

  const handleMarkerClick = useCallback(
    (obs: MapObservation) => {
      onSelectObservation(obs);
      setPopupObs(obs);
      mapRef.current?.flyTo({
        center: [obs.longitude, obs.latitude],
        zoom: Math.max(mapRef.current.getZoom(), 12),
        duration: 1200,
      });
    },
    [onSelectObservation]
  );

  const handleClosePopup = useCallback(() => {
    setPopupObs(null);
  }, []);

  // Emit viewport bounds when the map stops moving
  const handleMoveEnd = useCallback(
    (e: ViewStateChangeEvent) => {
      if (!onBoundsChange || !mapRef.current) return;
      const map = mapRef.current.getMap();
      const b = map.getBounds();
      if (b) {
        onBoundsChange({
          swLat: b.getSouthWest().lat,
          swLng: b.getSouthWest().lng,
          neLat: b.getNorthEast().lat,
          neLng: b.getNorthEast().lng,
        });
      }
    },
    [onBoundsChange]
  );

  // Emit initial bounds once the map loads
  const handleLoad = useCallback(() => {
    if (!onBoundsChange || !mapRef.current) return;
    const map = mapRef.current.getMap();
    const b = map.getBounds();
    if (b) {
      onBoundsChange({
        swLat: b.getSouthWest().lat,
        swLng: b.getSouthWest().lng,
        neLat: b.getNorthEast().lat,
        neLng: b.getNorthEast().lng,
      });
    }
  }, [onBoundsChange]);

  // Listen for fly-to events from the sidebar
  useEffect(() => {
    const handler = (e: Event) => {
      const { longitude, latitude } = (e as CustomEvent).detail;
      mapRef.current?.flyTo({
        center: [longitude, latitude],
        zoom: Math.max(mapRef.current.getZoom(), 12),
        duration: 1200,
      });
    };
    window.addEventListener("birdsight:flyto", handler);
    return () => window.removeEventListener("birdsight:flyto", handler);
  }, []);

  const getGradeStyle = (grade: string) => {
    if (grade === "RESEARCH_GRADE") return "bg-emerald-100 text-emerald-700";
    return "bg-amber-100 text-amber-700";
  };

  const getGradeLabel = (grade: string) => {
    if (grade === "RESEARCH_GRADE") return "Research Grade";
    return "Needs ID";
  };

  return (
    <div className="relative w-full h-full">
      <MapGL
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        reuseMaps
        onMoveEnd={handleMoveEnd}
        onLoad={handleLoad}
      >
        {/* Controls */}
        <NavigationControl position="bottom-right" showCompass visualizePitch />
        <GeolocateControl position="bottom-right" />
        <ScaleControl position="bottom-left" />

        {/* Markers */}
        {observations.map((obs) => {
          const isSelected = selectedId === obs.id;
          const isResearchGrade = obs.qualityGrade === "RESEARCH_GRADE";

          return (
            <Marker
              key={obs.id}
              longitude={obs.longitude}
              latitude={obs.latitude}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(obs);
              }}
            >
              <div
                className={`
                  relative flex items-center justify-center cursor-pointer
                  transition-all duration-300 ease-out
                  ${isSelected ? "scale-125 z-10" : "hover:scale-110"}
                `}
              >
                {/* Pulse ring for research grade */}
                {isResearchGrade && (
                  <span className="absolute w-10 h-10 rounded-full bg-emerald-400/30 animate-ping" />
                )}

                {/* Marker dot */}
                <span
                  className={`
                    relative flex items-center justify-center
                    w-9 h-9 rounded-full shadow-lg
                    border-2 text-base
                    transition-colors duration-200
                    ${
                      isSelected
                        ? "bg-emerald-500 border-white shadow-emerald-500/40"
                        : isResearchGrade
                          ? "bg-white border-emerald-500 hover:border-emerald-600"
                          : "bg-white border-amber-400 hover:border-amber-500"
                    }
                  `}
                >
                  <span className="select-none leading-none">🐦</span>
                </span>
              </div>
            </Marker>
          );
        })}

        {/* Popup */}
        {popupObs && (
          <Popup
            longitude={popupObs.longitude}
            latitude={popupObs.latitude}
            anchor="bottom"
            offset={20}
            closeOnClick={false}
            onClose={handleClosePopup}
            className="observation-popup"
            maxWidth="280px"
          >
            <div className="p-1">
              {/* Species header */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="min-w-0">
                  <h3 className="font-semibold text-stone-900 text-sm leading-tight truncate">
                    {popupObs.species}
                  </h3>
                  {popupObs.speciesScientific && (
                    <p className="text-[11px] text-stone-400 italic truncate">
                      {popupObs.speciesScientific}
                    </p>
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${getGradeStyle(popupObs.qualityGrade)}`}
                >
                  {getGradeLabel(popupObs.qualityGrade)}
                </span>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-1 text-xs text-stone-500">
                {popupObs.location && (
                  <span className="flex items-center gap-1">
                    📍 {popupObs.location}
                  </span>
                )}
                {popupObs.user && (
                  <span className="font-medium text-stone-600">
                    @{popupObs.user}
                  </span>
                )}
              </div>

              {/* View observation link */}
              <Link
                href={`/observations/${popupObs.id}`}
                className="mt-2 flex items-center justify-center gap-1 w-full text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg py-1.5 transition-colors duration-200"
              >
                View observation →
              </Link>
            </div>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}
