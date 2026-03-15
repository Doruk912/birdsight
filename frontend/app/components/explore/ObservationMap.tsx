"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MapGL, {
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapObservation } from "@/app/types/explore";

interface ObservationMapProps {
  observations: MapObservation[];
  selectedId: number | null;
  onSelectObservation: (obs: MapObservation | null) => void;
}

const INITIAL_VIEW = {
  longitude: 10,
  latitude: 30,
  zoom: 2.2,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

export default function ObservationMap({
  observations,
  selectedId,
  onSelectObservation,
}: ObservationMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [popupObs, setPopupObs] = useState<MapObservation | null>(null);

  const handleMarkerClick = useCallback(
    (obs: MapObservation) => {
      onSelectObservation(obs);
      setPopupObs(obs);
      mapRef.current?.flyTo({
        center: [obs.longitude, obs.latitude],
        zoom: Math.max(mapRef.current.getZoom(), 6),
        duration: 1200,
      });
    },
    [onSelectObservation]
  );

  const handleClosePopup = useCallback(() => {
    setPopupObs(null);
  }, []);

  // Listen for fly-to events from the sidebar
  useEffect(() => {
    const handler = (e: Event) => {
      const { longitude, latitude } = (e as CustomEvent).detail;
      mapRef.current?.flyTo({
        center: [longitude, latitude],
        zoom: Math.max(mapRef.current.getZoom(), 6),
        duration: 1200,
      });
    };
    window.addEventListener("birdsight:flyto", handler);
    return () => window.removeEventListener("birdsight:flyto", handler);
  }, []);

  return (
    <div className="relative w-full h-full">
      <MapGL
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        reuseMaps
      >
        {/* Controls */}
        <NavigationControl position="bottom-right" showCompass visualizePitch />
        <GeolocateControl position="bottom-right" />
        <ScaleControl position="bottom-left" />

        {/* Markers */}
        {observations.map((obs) => {
          const isSelected = selectedId === obs.id;
          const isRare = obs.badge === "Rare";

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
                {/* Pulse ring for rare species */}
                {isRare && (
                  <span className="absolute w-10 h-10 rounded-full bg-rose-400/30 animate-ping" />
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
                        : "bg-white border-emerald-500/70 hover:border-emerald-500"
                    }
                  `}
                >
                  <span className="select-none leading-none">{obs.emoji}</span>
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
                {popupObs.badge && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${popupObs.badgeColor}`}
                  >
                    {popupObs.badge}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col gap-1 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  📍 {popupObs.location}
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-stone-600">
                    @{popupObs.user}
                  </span>
                  <span className="text-stone-400">{popupObs.timeAgo}</span>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </MapGL>
    </div>
  );
}
