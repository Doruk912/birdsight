"use client";

import { useRef } from "react";
import MapGL, { Marker, NavigationControl, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, ExternalLink } from "lucide-react";

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
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div className="rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-sm">
      {/* Map — reduced height */}
      <div className="w-full h-[180px]">
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

      {/* Location info + Google Maps link */}
      <div className="px-4 py-3 bg-stone-50/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-stone-600 min-w-0">
          <MapPin size={14} className="text-emerald-600 shrink-0" strokeWidth={2} />
          {locationName ? (
            <span className="font-medium truncate">{locationName}</span>
          ) : (
            <span className="text-stone-400 truncate">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </span>
          )}
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 whitespace-nowrap transition-colors"
        >
          <ExternalLink size={12} strokeWidth={2.5} />
          View on Maps
        </a>
      </div>
    </div>
  );
}
