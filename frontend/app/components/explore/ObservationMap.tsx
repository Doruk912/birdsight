"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import MapGL, {
  NavigationControl,
  GeolocateControl,
  ScaleControl,
  Popup,
  MapRef,
  Source,
  Layer,
} from "react-map-gl/maplibre";
import type { MapLayerMouseEvent, GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapObservation } from "@/app/types/explore";
import { Calendar, MessageCircle, Pencil, X } from "lucide-react";

interface ObservationMapProps {
  observations: MapObservation[];
  selectedId: string | null;
  onSelectObservation: (obs: MapObservation | null) => void;
  onBoundingBoxDraw?: (
    bounds: {
      swLat: number;
      swLng: number;
      neLat: number;
      neLng: number;
    } | null,
  ) => void;
}

const INITIAL_VIEW = {
  longitude: 29.0,
  latitude: 41.0,
  zoom: 10,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

function observationsToGeoJSON(observations: MapObservation[]) {
  return {
    type: "FeatureCollection" as const,
    features: observations.map((obs) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [obs.longitude, obs.latitude],
      },
      properties: {
        id: obs.id,
        species: obs.species,
        speciesScientific: obs.speciesScientific || "",
        qualityGrade: obs.qualityGrade,
        thumbnailUrl: obs.thumbnailUrl || "",
        observedAt: obs.observedAt || "",
        identificationCount: obs.identificationCount ?? 0,
        username: obs.username || "",
        locationName: obs.locationName || "",
      },
    })),
  };
}

export default function ObservationMap({
  observations,
  selectedId,
  onSelectObservation,
  onBoundingBoxDraw,
}: ObservationMapProps) {
  const mapRef = useRef<MapRef>(null);

  const selectedObservation =
    selectedId != null
      ? (observations.find((obs) => obs.id === selectedId) ?? null)
      : null;

  // Bounding box drawing state
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawStart, setDrawStart] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const [drawnBox, setDrawnBox] = useState<{
    swLat: number;
    swLng: number;
    neLat: number;
    neLng: number;
  } | null>(null);

  const geojson = observationsToGeoJSON(observations);

  // --- Click handlers ---

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (drawingMode) return;

      const map = mapRef.current?.getMap();
      if (!map) return;

      // Check cluster click first
      const clusterFeatures = map.queryRenderedFeatures(e.point, {
        layers: ["cluster-circles"],
      });
      if (clusterFeatures.length > 0) {
        const feature = clusterFeatures[0];
        const clusterId = feature.properties?.cluster_id;
        const source = map.getSource("observations") as GeoJSONSource;
        if (source && clusterId !== undefined) {
          source.getClusterExpansionZoom(clusterId).then((zoom) => {
            const geom = feature.geometry;
            if (geom.type === "Point") {
              map.flyTo({
                center: [geom.coordinates[0], geom.coordinates[1]],
                zoom: zoom + 1,
                duration: 800,
              });
            }
          });
        }
        return;
      }

      // Check unclustered point click
      const pointFeatures = map.queryRenderedFeatures(e.point, {
        layers: ["unclustered-points"],
      });
      if (pointFeatures.length > 0) {
        const props = pointFeatures[0].properties;
        if (!props) return;
        const geometry = pointFeatures[0].geometry;
        const featureId = String(props.id);
        const matched = observations.find((obs) => obs.id === featureId);
        const [lng, lat] =
          geometry.type === "Point"
            ? geometry.coordinates
            : [e.lngLat.lng, e.lngLat.lat];
        const obs: MapObservation = {
          id: featureId,
          species: props.species,
          speciesScientific: props.speciesScientific || undefined,
          qualityGrade: props.qualityGrade,
          latitude: lat,
          longitude: lng,
          thumbnailUrl: props.thumbnailUrl || undefined,
          observedAt: props.observedAt || undefined,
          identificationCount: props.identificationCount ?? 0,
          username: props.username || undefined,
          locationName: props.locationName || undefined,
        };
        onSelectObservation(matched ?? obs);
        return;
      }

      // Clicked empty map
      onSelectObservation(null);
    },
    [drawingMode, onSelectObservation, observations],
  );

  // Close popup
  const closePopup = useCallback(() => {
    onSelectObservation(null);
  }, [onSelectObservation]);

  // --- Bounding box drawing ---
  const handleMouseDown = (e: MapLayerMouseEvent) => {
    if (!drawingMode) return;
    e.preventDefault();
    setDrawStart({ lng: e.lngLat.lng, lat: e.lngLat.lat });
  };

  const handleMouseUp = (e: MapLayerMouseEvent) => {
    if (!drawingMode || !drawStart) return;
    const box = {
      swLat: Math.min(drawStart.lat, e.lngLat.lat),
      swLng: Math.min(drawStart.lng, e.lngLat.lng),
      neLat: Math.max(drawStart.lat, e.lngLat.lat),
      neLng: Math.max(drawStart.lng, e.lngLat.lng),
    };
    setDrawnBox(box);
    setDrawStart(null);
    setDrawingMode(false);
    onBoundingBoxDraw?.(box);
  };

  const clearBoundingBox = useCallback(() => {
    setDrawnBox(null);
    onBoundingBoxDraw?.(null);
  }, [onBoundingBoxDraw]);

  // Toggle drawing mode cursor
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.getCanvas().style.cursor = drawingMode ? "crosshair" : "";
  }, [drawingMode]);

  // Disable map drag during drawing
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    if (drawingMode) {
      map.dragPan.disable();
    } else {
      map.dragPan.enable();
    }
  }, [drawingMode]);

  // Listen for fly-to events from the sidebar
  useEffect(() => {
    const handler = (e: Event) => {
      const { longitude, latitude } = (e as CustomEvent).detail;
      mapRef.current?.flyTo({
        center: [longitude, latitude],
        zoom: Math.max(mapRef.current.getZoom(), 14),
        duration: 1200,
      });
    };
    window.addEventListener("birdsight:flyto", handler);
    return () => window.removeEventListener("birdsight:flyto", handler);
  }, []);

  // Hover cursor for interactive layers
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const setCursor = () => {
      if (!drawingMode) map.getCanvas().style.cursor = "pointer";
    };
    const resetCursor = () => {
      if (!drawingMode) map.getCanvas().style.cursor = "";
    };

    map.on("mouseenter", "cluster-circles", setCursor);
    map.on("mouseleave", "cluster-circles", resetCursor);
    map.on("mouseenter", "unclustered-points", setCursor);
    map.on("mouseleave", "unclustered-points", resetCursor);

    return () => {
      map.off("mouseenter", "cluster-circles", setCursor);
      map.off("mouseleave", "cluster-circles", resetCursor);
      map.off("mouseenter", "unclustered-points", setCursor);
      map.off("mouseleave", "unclustered-points", resetCursor);
    };
  }, [drawingMode]);

  // Build bounding box GeoJSON for drawing overlay
  const bboxGeoJSON = drawnBox
    ? {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            geometry: {
              type: "Polygon" as const,
              coordinates: [
                [
                  [drawnBox.swLng, drawnBox.swLat],
                  [drawnBox.neLng, drawnBox.swLat],
                  [drawnBox.neLng, drawnBox.neLat],
                  [drawnBox.swLng, drawnBox.neLat],
                  [drawnBox.swLng, drawnBox.swLat],
                ],
              ],
            },
            properties: {},
          },
        ],
      }
    : { type: "FeatureCollection" as const, features: [] };

  const getGradeLabel = (grade: string) =>
    grade === "RESEARCH_GRADE" ? "Research Grade" : "Needs ID";
  const getGradeStyle = (grade: string) =>
    grade === "RESEARCH_GRADE"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";

  return (
    <div className="relative w-full h-full">
      <MapGL
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        reuseMaps
        interactiveLayerIds={["cluster-circles", "unclustered-points"]}
        onClick={handleMapClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Controls */}
        <NavigationControl position="bottom-right" showCompass visualizePitch />
        <GeolocateControl position="bottom-right" />
        <ScaleControl position="bottom-left" />

        {/* Observation GeoJSON Source with clustering */}
        <Source
          id="observations"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={60}
        >
          {/* Heatmap layer — visible at low zoom */}
          <Layer
            id="heatmap-layer"
            type="heatmap"
            maxzoom={11}
            paint={{
              "heatmap-weight": 1,
              "heatmap-intensity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                0.6,
                11,
                1.2,
              ],
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(16,185,129,0)",
                0.1,
                "rgba(16,185,129,0.15)",
                0.3,
                "rgba(16,185,129,0.35)",
                0.5,
                "rgba(5,150,105,0.55)",
                0.7,
                "rgba(4,120,87,0.7)",
                1,
                "rgba(6,95,70,0.9)",
              ],
              "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                8,
                6,
                25,
                11,
                40,
              ],
              "heatmap-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                9,
                0.8,
                11,
                0,
              ],
            }}
          />

          {/* Cluster circle layer — visible at medium zoom */}
          <Layer
            id="cluster-circles"
            type="circle"
            filter={["has", "point_count"]}
            paint={{
              "circle-color": [
                "step",
                ["get", "point_count"],
                "#6ee7b7",
                5,
                "#34d399",
                15,
                "#10b981",
                30,
                "#059669",
              ],
              "circle-radius": [
                "step",
                ["get", "point_count"],
                18,
                5,
                22,
                15,
                28,
                30,
                34,
              ],
              "circle-stroke-width": 2,
              "circle-stroke-color": "rgba(255,255,255,0.8)",
              "circle-opacity": 0.9,
            }}
          />

          {/* Cluster count label */}
          <Layer
            id="cluster-count"
            type="symbol"
            filter={["has", "point_count"]}
            layout={{
              "text-field": "{point_count_abbreviated}",
              "text-size": 13,
              "text-font": ["Open Sans Bold"],
              "text-allow-overlap": true,
            }}
            paint={{
              "text-color": "#fff",
            }}
          />

          {/* Unclustered individual points */}
          <Layer
            id="unclustered-points"
            type="circle"
            filter={["!", ["has", "point_count"]]}
            paint={{
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                10,
                4,
                14,
                6,
                18,
                8,
              ],
              "circle-color": [
                "case",
                ["==", ["get", "qualityGrade"], "RESEARCH_GRADE"],
                "#10b981",
                "#f59e0b",
              ],
              "circle-stroke-width": 2,
              "circle-stroke-color": "#fff",
              "circle-opacity": 0.9,
            }}
          />
        </Source>

        {/* Bounding box overlay */}
        <Source id="bbox-overlay" type="geojson" data={bboxGeoJSON}>
          <Layer
            id="bbox-fill"
            type="fill"
            paint={{
              "fill-color": "#10b981",
              "fill-opacity": 0.08,
            }}
          />
          <Layer
            id="bbox-outline"
            type="line"
            paint={{
              "line-color": "#10b981",
              "line-width": 2,
              "line-dasharray": [4, 3],
            }}
          />
        </Source>

        {/* Popup must stay inside MapGL so react-map-gl context is available */}
        {selectedObservation && (
          <Popup
            className="observation-popup"
            longitude={selectedObservation.longitude}
            latitude={selectedObservation.latitude}
            anchor="bottom"
            offset={12}
            closeButton={false}
            closeOnClick={false}
            onClose={closePopup}
          >
            <div className="map-popup relative">
              <button
                onClick={closePopup}
                className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>

              {/* Thumbnail */}
              {selectedObservation.thumbnailUrl && (
                <div className="w-full h-28 overflow-hidden rounded-t-xl">
                  <img
                    src={selectedObservation.thumbnailUrl}
                    alt={selectedObservation.species}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-3 space-y-2">
                {/* Species header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-stone-900 text-sm leading-tight truncate">
                      {selectedObservation.species}
                    </h3>
                    {selectedObservation.speciesScientific && (
                      <p className="text-[11px] text-stone-400 italic truncate">
                        {selectedObservation.speciesScientific}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${getGradeStyle(selectedObservation.qualityGrade)}`}
                  >
                    {getGradeLabel(selectedObservation.qualityGrade)}
                  </span>
                </div>

                {/* Meta info */}
                <div className="flex flex-col gap-1 text-xs text-stone-500">
                  {selectedObservation.observedAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={11} className="shrink-0" />
                      {new Date(
                        selectedObservation.observedAt,
                      ).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MessageCircle size={11} />
                      {selectedObservation.identificationCount} IDs
                    </span>
                    {selectedObservation.username && (
                      <span className="font-medium text-stone-600">
                        @{selectedObservation.username}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/observations/${selectedObservation.id}`}
                  className="flex items-center justify-center gap-1 w-full text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg py-1.5 transition-colors duration-200"
                >
                  View observation →
                </Link>
              </div>
            </div>
          </Popup>
        )}
      </MapGL>

      {/* Bounding box drawing toolbar */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          onClick={() => {
            if (drawingMode) {
              setDrawingMode(false);
              setDrawStart(null);
            } else {
              setDrawingMode(true);
              onSelectObservation(null);
            }
          }}
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center
            shadow-md border transition-all duration-200 cursor-pointer
            ${
              drawingMode
                ? "bg-emerald-500 text-white border-emerald-400"
                : "bg-white/90 backdrop-blur-md text-stone-600 hover:text-stone-900 border-stone-200 hover:bg-white"
            }
          `}
          title={drawingMode ? "Cancel drawing" : "Draw bounding box"}
        >
          <Pencil size={15} strokeWidth={1.8} />
        </button>
        {drawnBox && (
          <button
            onClick={clearBoundingBox}
            className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/90 backdrop-blur-md border border-stone-200 shadow-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 cursor-pointer"
            title="Clear bounding box"
          >
            <X size={15} strokeWidth={1.8} />
          </button>
        )}
      </div>
    </div>
  );
}
