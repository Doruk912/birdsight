"use client";

import { useRef } from "react";
import MapGL, { Marker, NavigationControl, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";

interface ObservationMiniMapProps {
  latitude: number;
  longitude: number;
  locationName?: string | null;
}

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

export default function ObservationMiniMap({
  latitude,
  longitude,
  locationName,
}: ObservationMiniMapProps) {
  const mapRef = useRef<MapRef>(null);

  return (
    <div className="rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm">
      <div className="w-full h-[250px]">
        <MapGL
          ref={mapRef}
          initialViewState={{
            longitude,
            latitude,
            zoom: 12,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle={MAP_STYLE}
          attributionControl={false}
          interactive={true}
          scrollZoom={false}
          reuseMaps
        >
          <NavigationControl position="top-right" showCompass={false} />

          <Marker longitude={longitude} latitude={latitude} anchor="center">
            <div className="flex items-center justify-center w-10 h-10">
              <span className="absolute w-10 h-10 rounded-full bg-emerald-400/30 animate-ping" />
              <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 border-2 border-white shadow-lg">
                <span className="text-white text-sm">🐦</span>
              </span>
            </div>
          </Marker>
        </MapGL>
      </div>

      {/* Location info */}
      <div className="px-4 py-3 bg-stone-50/80">
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <MapPin size={14} className="text-emerald-600 shrink-0" strokeWidth={2} />
          {locationName ? (
            <span className="font-medium">{locationName}</span>
          ) : (
            <span className="text-stone-400">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
