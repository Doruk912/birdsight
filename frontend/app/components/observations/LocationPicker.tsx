"use client";

import { useState } from "react";
import MapGL, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin, Crosshair, Loader2 } from "lucide-react";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

interface LocationPickerProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number; name?: string };
}

export default function LocationPicker({
  onLocationChange,
  initialLocation,
}: LocationPickerProps) {
  // Default roughly centered, user can pan or use current location
  const [viewState, setViewState] = useState({
    longitude: initialLocation?.lng || 28.9784,
    latitude: initialLocation?.lat || 41.0082,
    zoom: initialLocation ? 14 : 10,
  });
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLocation
      ? { lat: initialLocation.lat, lng: initialLocation.lng }
      : null,
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleMapClick = (e: { lngLat: { lat: number; lng: number } }) => {
    const lat = e.lngLat.lat;
    const lng = e.lngLat.lng;
    setMarker({ lat, lng });
    setLocationError(null);
    onLocationChange(lat, lng);
  };

  const useCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationError("Could not get your current location.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setViewState((prev) => ({ ...prev, latitude, longitude, zoom: 14 }));
        setMarker({ lat: latitude, lng: longitude });
        onLocationChange(latitude, longitude);
        setLocationError(null);
        setIsLocating(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(
            "Location access is blocked. Please allow location permission and try again.",
          );
        } else if (error.code === error.TIMEOUT) {
          setLocationError("Could not get your current location.");
        } else {
          setLocationError("Could not get your current location.");
        }
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-stone-700">
          Location <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLocating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Crosshair size={14} />
          )}
          {isLocating ? "Locating..." : "Use Current Location"}
        </button>
      </div>

      {locationError && (
        <p className="text-xs font-medium text-red-500/80">{locationError}</p>
      )}

      <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm relative h-90 bg-stone-100">
        <MapGL
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={handleMapClick}
          style={{ width: "100%", height: "100%" }}
          mapStyle={MAP_STYLE}
          interactive={true}
        >
          <NavigationControl position="top-right" showCompass={false} />
          {marker && (
            <Marker
              longitude={marker.lng}
              latitude={marker.lat}
              anchor="bottom"
            >
              <div
                className="relative z-10 flex items-center justify-center"
                aria-label="Selected location marker"
              >
                <span className="absolute w-8 h-8 rounded-full bg-emerald-500/25 animate-pulse" />
                <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-emerald-600 border-2 border-white shadow-lg">
                  <MapPin size={16} className="text-white" />
                </span>
              </div>
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
