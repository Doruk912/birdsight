"use client";

import { useState } from "react";
import MapGL, { Marker, NavigationControl } from "react-map-gl/maplibre";
import { MapPin, Crosshair } from "lucide-react";

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ onLocationChange }: LocationPickerProps) {
  // Default roughly centered, user can pan or use current location
  const [viewState, setViewState] = useState({
    longitude: -0.1276,
    latitude: 51.5072,
    zoom: 8
  });
  const [marker, setMarker] = useState<{lat: number; lng: number} | null>(null);

  const handleMapClick = (e: { lngLat: { lat: number; lng: number } }) => {
    const lat = e.lngLat.lat;
    const lng = e.lngLat.lng;
    setMarker({ lat, lng });
    onLocationChange(lat, lng);
  };

  const useCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewState((prev) => ({ ...prev, latitude, longitude, zoom: 14 }));
        setMarker({ lat: latitude, lng: longitude });
        onLocationChange(latitude, longitude);
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-stone-700">Location <span className="text-red-500">*</span></label>
        <button
          type="button"
          onClick={useCurrentLocation}
          className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-full transition-colors"
        >
          <Crosshair size={14} /> Use Current Location
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm relative h-[360px] bg-stone-100">
        <MapGL
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          onClick={handleMapClick}
          style={{ width: "100%", height: "100%" }}
          mapStyle={MAP_STYLE}
          interactive={true}
        >
          <NavigationControl position="top-right" showCompass={false} />
          {marker && (
            <Marker longitude={marker.lng} latitude={marker.lat} anchor="bottom">
              <MapPin size={32} className="text-emerald-600 drop-shadow-md" fill="white" />
            </Marker>
          )}
        </MapGL>
        
        {!marker && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-5 py-2.5 rounded-full text-sm font-medium text-stone-700 shadow-md flex items-center gap-2 pointer-events-none ring-1 ring-stone-900/5">
            <MapPin size={16} className="text-emerald-600" />
            Click on the map to set location
          </div>
        )}
      </div>
    </div>
  );
}
