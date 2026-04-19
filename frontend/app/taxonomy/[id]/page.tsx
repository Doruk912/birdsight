"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ChevronRight,
  Eye,
  Loader2,
  AlertCircle,
  Pencil,
  Save,
  X,
  MapPin,
  BookOpen,
  TreePine,
  Camera,
} from "lucide-react";
import { TaxonDetailResponse, MapObservation } from "@/app/types/explore";
import { fetchTaxonDetail, updateTaxon } from "@/app/lib/taxonomyService";
import { useAuth } from "@/app/hooks/useAuth";
import "./taxonomy-detail.css";

// Dynamic import for map (avoid SSR issues with MapLibre)
const ObservationMap = dynamic(
  () => import("@/app/components/explore/ObservationMap"),
  { ssr: false }
);

const RANK_LABELS: Record<string, string> = {
  CLASS: "Class",
  ORDER: "Order",
  FAMILY: "Family",
  GENUS: "Genus",
  SPECIES: "Species",
};

const TABS = [
  { id: "about", label: "About", icon: BookOpen },
  { id: "taxonomy", label: "Taxonomy", icon: TreePine },
  { id: "map", label: "Map", icon: MapPin },
  { id: "observations", label: "Observations", icon: Camera },
] as const;

type TabId = (typeof TABS)[number]["id"];
export default function TaxonDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();

  const [taxon, setTaxon] = useState<TaxonDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("about");

  // Map state
  const [mapObservations, setMapObservations] = useState<MapObservation[]>([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Curator edit state
  const [editing, setEditing] = useState(false);
  const [editCoverUrl, setEditCoverUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setMapLoaded(false);
    setActiveTab("about");
    fetchTaxonDetail(id)
      .then((data) => {
        setTaxon(data);
        setEditCoverUrl(data.coverImageUrl || "");
      })
      .catch((err) => setError(err?.message || "Failed to load taxon."))
      .finally(() => setLoading(false));
  }, [id]);

  // Load map observations when the map tab is activated
  const loadMapData = useCallback(async () => {
    if (mapLoaded || mapLoading) return;
    setMapLoading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${API_BASE}/api/v1/observations/map?taxonId=${id}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setMapObservations(
          data.map((obs: Record<string, unknown>) => ({
            id: obs.id as string,
            species: (obs.speciesCommonName as string) || "Unknown species",
            speciesScientific: (obs.speciesScientificName as string) || undefined,
            qualityGrade: obs.qualityGrade as "NEEDS_ID" | "RESEARCH_GRADE",
            latitude: obs.latitude as number,
            longitude: obs.longitude as number,
            thumbnailUrl: (obs.thumbnailUrl as string) || undefined,
            observedAt: (obs.observedAt as string) || undefined,
            identificationCount: (obs.identificationCount as number) ?? 0,
            username: (obs.username as string) || undefined,
            locationName: (obs.locationName as string) || undefined,
          }))
        );
      }
    } catch (e) {
      console.error("Failed to load map data:", e);
    } finally {
      setMapLoading(false);
      setMapLoaded(true);
    }
  }, [id, mapLoaded, mapLoading]);

  useEffect(() => {
    if (activeTab === "map") {
      loadMapData();
    }
  }, [activeTab, loadMapData]);

  const handleSave = async () => {
    if (!taxon) return;
    setSaving(true);
    try {
      const updated = await updateTaxon(taxon.id, {
        coverImageUrl: editCoverUrl || undefined,
      });
      setTaxon(updated);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update taxon:", err);
    } finally {
      setSaving(false);
    }
  };

  const isCuratorOrAdmin =
    user &&
    (user.role === "CURATOR" ||
      user.role === "ADMIN" ||
      user.role === "ROLE_CURATOR" ||
      user.role === "ROLE_ADMIN");

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-400">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm font-medium">Loading taxon…</span>
        </div>
      </div>
    );
  }

  if (error || !taxon) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-lg font-semibold text-stone-800 mb-2">Taxon not found</h2>
          <p className="text-sm text-stone-500 mb-6">
            {error || "The taxon you're looking for doesn't exist."}
          </p>
          <Link
            href="/taxonomy"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            ← Go to taxonomy
          </Link>
        </div>
      </div>
    );
  }

  const displayScientific =
    taxon.rank === "SPECIES"
      ? taxon.scientificName
      : `${RANK_LABELS[taxon.rank] || taxon.rank} ${taxon.scientificName}`;

  const displayName = taxon.commonName || taxon.scientificName;

  const wikipediaSlug = taxon.scientificName.replace(/ /g, "_");

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      <div className="taxon-page-container">
        {/* ── Breadcrumb ── */}
        <nav className="taxon-breadcrumb">
          {taxon.ancestors.map((a, index) => (
            <span key={a.id} className="flex items-center gap-1">
              {index > 0 && <ChevronRight size={12} className="text-stone-300" />}
              <Link href={`/taxonomy/${a.id}`} className="taxon-breadcrumb-link">
                {a.commonName || a.scientificName}
              </Link>
            </span>
          ))}
          <span className="flex items-center gap-1">
            {taxon.ancestors.length > 0 && (
              <ChevronRight size={12} className="text-stone-300" />
            )}
            <span className="text-stone-800 font-medium">{displayName}</span>
          </span>
        </nav>

        {/* ── Header ── */}
        <div className="taxon-header">
          <div className="flex-1 min-w-0">
            <h1 className="taxon-title">{displayName}</h1>
            {(taxon.commonName || taxon.rank !== "SPECIES") && (
              <p className="taxon-scientific-name">{displayScientific}</p>
            )}
          </div>
        </div>

        <div className="taxon-hero-row">
          {taxon.coverImageUrl ? (
            <div className="taxon-cover-wrapper">
              <img
                src={taxon.coverImageUrl}
                alt={displayName}
                className="taxon-cover-img"
              />
            </div>
          ) : (
            <div className="taxon-cover-wrapper flex flex-col items-center justify-center bg-stone-50 text-stone-400 border border-stone-100">
              <Camera size={48} className="mb-3 opacity-20" />
              <span className="text-base font-medium">No cover image available</span>
            </div>
          )}

          <div className="taxon-stats-card">
            {taxon.observationCount > 0 ? (
              <>
                <div className="taxon-stats-section border-b border-stone-200 pb-4 mb-4">
                  <span className="taxon-stats-section-title block text-sm font-medium text-stone-500 mb-2">Total Observations</span>
                  <div className="flex items-center justify-between">
                    <span className="taxon-stats-value text-3xl font-bold text-stone-800">{taxon.observationCount.toLocaleString()}</span>
                    <Link
                      href={`/observations?search=${encodeURIComponent(taxon.scientificName)}`}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-md hover:bg-emerald-100 transition-colors"
                    >
                      View Observations
                    </Link>
                  </div>
                </div>

                {taxon.topObserver && (
                  <div className="taxon-stats-section border-b border-stone-200 pb-4 mb-4">
                    <span className="taxon-stats-section-title block text-sm font-medium text-stone-500 mb-2">Top Observer</span>
                    <Link prefetch={false} href={`/profile/${taxon.topObserver.username}`} className="taxon-top-observer flex items-center gap-3 hover:bg-stone-50 p-2 -ml-2 rounded-lg transition-colors">
                      <img
                        src={taxon.topObserver.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(taxon.topObserver.displayName || taxon.topObserver.username)}&background=random`}
                        alt={taxon.topObserver.displayName || taxon.topObserver.username}
                        className="taxon-observer-avatar w-10 h-10 rounded-full object-cover"
                      />
                      <div className="taxon-observer-info flex flex-col">
                        <span className="taxon-observer-name font-medium text-stone-800">{taxon.topObserver.displayName || taxon.topObserver.username}</span>
                        <span className="taxon-observer-count text-sm text-stone-500">{taxon.topObserver.observationCount.toLocaleString()} observations</span>
                      </div>
                    </Link>
                  </div>
                )}

                {taxon.topIdentifier && (
                  <div className="taxon-stats-section">
                    <span className="taxon-stats-section-title block text-sm font-medium text-stone-500 mb-2">Top Identifier</span>
                    <Link prefetch={false} href={`/profile/${taxon.topIdentifier.username}`} className="taxon-top-observer flex items-center gap-3 hover:bg-stone-50 p-2 -ml-2 rounded-lg transition-colors">
                      <img
                        src={taxon.topIdentifier.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(taxon.topIdentifier.displayName || taxon.topIdentifier.username)}&background=random`}
                        alt={taxon.topIdentifier.displayName || taxon.topIdentifier.username}
                        className="taxon-observer-avatar w-10 h-10 rounded-full object-cover"
                      />
                      <div className="taxon-observer-info flex flex-col">
                        <span className="taxon-observer-name font-medium text-stone-800">{taxon.topIdentifier.displayName || taxon.topIdentifier.username}</span>
                        <span className="taxon-observer-count text-sm text-stone-500">{taxon.topIdentifier.identificationCount.toLocaleString()} identifications</span>
                      </div>
                    </Link>
                  </div>
                )}

                {!taxon.topObserver && !taxon.topIdentifier && (
                  <div className="taxon-stats-section">
                    <span className="text-base text-stone-500">No top contributor data available.</span>
                  </div>
                )}
              </>
            ) : (
              <div className="taxon-stats-section flex flex-col items-center justify-center text-stone-400 py-6 h-full mt-0">
                <Eye size={28} className="mb-2 opacity-40" />
                <span className="text-base font-medium">No observations yet</span>
                <span className="text-sm mt-1 text-center max-w-[200px]">Be the first to record this taxon!</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Nav Tabs ── */}
        <div className="taxon-tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`taxon-tab ${activeTab === tab.id ? "taxon-tab-active" : ""}`}
              >
                <Icon size={15} strokeWidth={2} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <div className="taxon-tab-content">
          {/* ─── ABOUT TAB ─── */}
          {activeTab === "about" && (
            <div className="taxon-about-panel">
              {editing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="taxon-section-title">Edit Details</h2>
                  </div>
                  <div>
                    <label className="taxon-label">Cover Image URL</label>
                    <input
                      type="text"
                      value={editCoverUrl}
                      onChange={(e) => setEditCoverUrl(e.target.value)}
                      placeholder="https://..."
                      className="taxon-input"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleSave} disabled={saving} className="taxon-save-btn">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setEditCoverUrl(taxon.coverImageUrl || "");
                      }}
                      className="taxon-cancel-btn"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {isCuratorOrAdmin && (
                    <div className="flex justify-end mb-3">
                      <button onClick={() => setEditing(true)} className="taxon-edit-btn">
                        <Pencil size={12} /> Edit
                      </button>
                    </div>
                  )}

                  {/* Wikipedia embed */}
                  <div className="taxon-wiki-embed">
                    <iframe
                      src={`https://en.m.wikipedia.org/wiki/${wikipediaSlug}`}
                      title={`Wikipedia — ${taxon.scientificName}`}
                      className="taxon-wiki-iframe"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* ─── TAXONOMY TAB ─── */}
          {activeTab === "taxonomy" && (
            <div className="taxon-taxonomy-panel">
              {/* Classification tree */}
              <div className="taxon-sidebar-card w-full max-w-2xl">
                <div className="flex justify-between items-center mb-3 border-b border-stone-200 pb-2">
                  <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider m-0">Classification</h3>
                  <span className="text-sm font-bold text-stone-500 uppercase tracking-wider">Observations</span>
                </div>
                <div className="taxon-tree space-y-2">
                  {taxon.ancestors.map((ancestor, i) => (
                    <Link
                      key={ancestor.id}
                      href={`/taxonomy/${ancestor.id}`}
                      className="taxon-tree-node flex items-center justify-between w-full hover:bg-stone-50 rounded px-2 py-1"
                      style={{ paddingLeft: `${i * 16}px` }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="taxon-tree-name flex items-center gap-1.5 flex-wrap">
                          <span>{ancestor.commonName || ancestor.scientificName}</span>
                          {ancestor.commonName ? (
                            <span className="text-stone-500 text-sm font-normal">
                              ({ancestor.rank === "SPECIES" ? ancestor.scientificName : `${RANK_LABELS[ancestor.rank] || ancestor.rank} ${ancestor.scientificName}`})
                            </span>
                          ) : (
                            <span className="text-stone-500 text-sm font-normal">
                              ({RANK_LABELS[ancestor.rank] || ancestor.rank} {ancestor.scientificName})
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="text-sm text-stone-600 font-semibold">
                        {ancestor.observationCount ? ancestor.observationCount.toLocaleString() : "0"}
                      </span>
                    </Link>
                  ))}
                  {/* Current */}
                  <div
                    className="taxon-tree-node taxon-tree-current flex items-center justify-between w-full bg-stone-100 rounded px-2 py-1.5"
                    style={{ paddingLeft: `${taxon.ancestors.length * 16}px` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="taxon-tree-name-current flex items-center gap-1.5 flex-wrap text-base">
                        <span>{displayName}</span>
                        {taxon.commonName ? (
                          <span className="text-stone-500 text-sm font-normal">
                            ({taxon.rank === "SPECIES" ? taxon.scientificName : `${RANK_LABELS[taxon.rank] || taxon.rank} ${taxon.scientificName}`})
                          </span>
                        ) : (
                          <span className="text-stone-500 text-sm font-normal">
                            ({RANK_LABELS[taxon.rank] || taxon.rank} {taxon.scientificName})
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-base text-stone-900 font-bold">
                      {taxon.observationCount ? taxon.observationCount.toLocaleString() : "0"}
                    </span>
                  </div>
                  {/* Children in tree */}
                  {taxon.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/taxonomy/${child.id}`}
                      className="taxon-tree-node flex items-center justify-between w-full hover:bg-stone-50 rounded px-2 py-1"
                      style={{ paddingLeft: `${(taxon.ancestors.length + 1) * 16}px` }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="taxon-tree-name flex items-center gap-1.5 flex-wrap">
                          <span>{child.commonName || child.scientificName}</span>
                          {child.commonName ? (
                            <span className="text-stone-500 text-sm font-normal">
                              ({child.rank === "SPECIES" ? child.scientificName : `${RANK_LABELS[child.rank] || child.rank} ${child.scientificName}`})
                            </span>
                          ) : (
                            <span className="text-stone-500 text-sm font-normal">
                              ({RANK_LABELS[child.rank] || child.rank} {child.scientificName})
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="text-sm text-stone-600 font-semibold">
                        {child.observationCount ? child.observationCount.toLocaleString() : "0"}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── MAP TAB ─── */}
          {activeTab === "map" && (
            <div className="taxon-map-panel">
              {mapLoading && (
                <div className="taxon-map-loading">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Loading map…</span>
                </div>
              )}
              <div className="taxon-map-container">
                <ObservationMap
                  observations={mapObservations}
                  selectedId={null}
                  onSelectObservation={() => { }}
                />
              </div>
              {mapLoaded && mapObservations.length === 0 && !mapLoading && (
                <p className="text-base text-stone-400 text-center mt-4">
                  No observations found for this taxon.
                </p>
              )}
            </div>
          )}

          {/* ─── OBSERVATIONS TAB ─── */}
          {activeTab === "observations" && (
            <div className="taxon-observations-panel">
              {taxon.recentObservations && taxon.recentObservations.length > 0 ? (
                <>
                  <div className="taxon-obs-grid">
                    {taxon.recentObservations.map((obs, i) => (
                      <Link
                        key={`${obs.id}-${i}`}
                        href={`/observations/${obs.id}`}
                        className="taxon-obs-thumb"
                      >
                        <img src={obs.imageUrl} alt={`Observation ${i + 1}`} />
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <Link
                      href={`/observations?search=${encodeURIComponent(taxon.scientificName)}`}
                      className="taxon-observations-link inline-flex"
                    >
                      <Eye size={15} />
                      View all observations
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-stone-400">
                  <Camera size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-base">No observations yet for this taxon.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
