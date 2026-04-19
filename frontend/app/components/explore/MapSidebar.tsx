"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  Calendar,
  MessageCircle,
  SlidersHorizontal,
  ChevronDown,
  X,
  User,
  Loader2,
} from "lucide-react";
import { MapObservation, ObservationFilterParams, UserSearchResult } from "@/app/types/explore";
import TaxonSearch from "@/app/components/observations/TaxonSearch";
import { userService } from "@/app/lib/userService";

interface MapSidebarProps {
  observations: MapObservation[];
  selectedId: string | null;
  onSelectObservation: (obs: MapObservation) => void;
  pendingFilters: ObservationFilterParams;
  onPendingFiltersChange: (filters: ObservationFilterParams) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const GRADES = [
  { key: "", label: "All" },
  { key: "RESEARCH_GRADE", label: "Research Grade" },
  { key: "NEEDS_ID", label: "Needs ID" },
];

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f5f5f4'/%3E%3Ctext x='50' y='55' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%23a8a29e'%3ENo photo%3C/text%3E%3C/svg%3E";

export default function MapSidebar({
  observations,
  selectedId,
  onSelectObservation,
  pendingFilters,
  onPendingFiltersChange,
  onApplyFilters,
  onClearFilters,
  loading,
}: MapSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // User search state
  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced user search
  useEffect(() => {
    if (!userQuery || userQuery.trim().length < 2) {
      setUserResults([]);
      return;
    }
    setUserLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await userService.searchUsers(userQuery.trim());
        setUserResults(results);
      } catch {
        setUserResults([]);
      } finally {
        setUserLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [userQuery]);

  const updatePending = useCallback(
    (partial: Partial<ObservationFilterParams>) => {
      onPendingFiltersChange({ ...pendingFilters, ...partial });
    },
    [pendingFilters, onPendingFiltersChange]
  );

  const handleSelectUser = useCallback(
    (user: UserSearchResult) => {
      updatePending({ userId: user.id });
      setSelectedUserName(user.displayName || user.username);
      setUserQuery("");
      setUserOpen(false);
    },
    [updatePending]
  );

  const removeUserFilter = useCallback(() => {
    updatePending({ userId: undefined });
    setSelectedUserName(null);
  }, [updatePending]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (pendingFilters.taxonId) count++;
    if (pendingFilters.userId) count++;
    if (pendingFilters.dateFrom) count++;
    if (pendingFilters.dateTo) count++;
    if (pendingFilters.grade) count++;
    return count;
  }, [pendingFilters]);

  const hasAnyFilter = !!pendingFilters.grade || !!pendingFilters.taxonId || !!pendingFilters.userId || !!pendingFilters.dateFrom || !!pendingFilters.dateTo;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={`
          absolute top-3 z-20 flex items-center justify-center
          w-9 h-9 rounded-lg
          bg-white/90 backdrop-blur-md border border-stone-200
          shadow-md hover:bg-white
          text-stone-600 hover:text-stone-900
          transition-all duration-300 cursor-pointer
          ${collapsed ? "left-3" : "left-93"}
        `}
        aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
      >
        {collapsed ? (
          <PanelLeftOpen size={16} strokeWidth={1.8} />
        ) : (
          <PanelLeftClose size={16} strokeWidth={1.8} />
        )}
      </button>

      {/* Sidebar panel */}
      <div
        className={`
          absolute top-0 left-0 z-10 h-full
          transition-transform duration-300 ease-in-out
          ${collapsed ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <div className="w-90 h-full bg-white/95 backdrop-blur-xl border-r border-stone-200 flex flex-col shadow-xl">
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-stone-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-stone-800">
                Observations
                <span className="ml-2 text-xs font-normal text-stone-400">
                  {observations.length} results
                </span>
              </h2>
              {loading && (
                <Loader2 size={14} className="animate-spin text-stone-400" />
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className={`
                w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium
                transition-all duration-200 cursor-pointer
                ${
                  filtersExpanded || activeFilterCount > 0
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
                }
              `}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${filtersExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {/* Expandable filter panel */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                filtersExpanded ? "max-h-175 opacity-100 mt-3" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col gap-4">
                {/* Quality Grade */}
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                    Quality Grade
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {GRADES.map((g) => (
                      <button
                        key={g.key}
                        onClick={() => updatePending({ grade: g.key || undefined })}
                        className={`text-[11px] font-medium px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 border ${
                          (pendingFilters.grade || "") === g.key
                            ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                            : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Taxon Search — using the rich TaxonSearch component */}
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                    Taxon
                  </div>
                  <TaxonSearch
                    onSelect={(taxonId) => updatePending({ taxonId })}
                    initialTaxonId={pendingFilters.taxonId}
                    label=""
                    hideOptional
                  />
                </div>

                {/* Observer */}
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                    Observer
                  </div>
                  {pendingFilters.userId && selectedUserName ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
                      <User size={12} />
                      {selectedUserName}
                      <button
                        onClick={removeUserFilter}
                        className="w-4 h-4 flex items-center justify-center rounded-full bg-emerald-200/50 hover:bg-emerald-300/60 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative" ref={userRef}>
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={13} />
                      <input
                        type="text"
                        placeholder="Search observer..."
                        value={userQuery}
                        onChange={(e) => {
                          setUserQuery(e.target.value);
                          setUserOpen(true);
                        }}
                        onFocus={() => userQuery.length >= 2 && setUserOpen(true)}
                        className="w-full py-2 pl-9 pr-3 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-stone-400"
                      />
                      {userLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 size={14} className="animate-spin text-stone-400" />
                        </div>
                      )}
                      {userOpen && userResults.length > 0 && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-stone-200 rounded-xl shadow-xl">
                          {userResults.map((u) => (
                            <div
                              key={u.id}
                              className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-emerald-50 transition-colors border-b border-stone-50 last:border-0"
                              onClick={() => handleSelectUser(u)}
                            >
                              {u.avatarUrl ? (
                                <img src={u.avatarUrl} alt={u.username} className="w-6 h-6 rounded-full object-cover" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center">
                                  <User size={12} className="text-stone-400" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="text-xs font-medium text-stone-800 truncate">{u.displayName || u.username}</div>
                                <div className="text-[10px] text-stone-400 truncate">@{u.username}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Date Range */}
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                    Date Range
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        size={12}
                      />
                      <input
                        type="date"
                        value={
                          pendingFilters.dateFrom
                            ? new Date(pendingFilters.dateFrom).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          updatePending({
                            dateFrom: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                          })
                        }
                        className="w-full py-2 pl-8 pr-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                        size={12}
                      />
                      <input
                        type="date"
                        value={
                          pendingFilters.dateTo
                            ? new Date(pendingFilters.dateTo).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          updatePending({
                            dateTo: e.target.value
                              ? new Date(e.target.value + "T23:59:59.999Z").toISOString()
                              : undefined,
                          })
                        }
                        className="w-full py-2 pl-8 pr-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Apply / Clear buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={onApplyFilters}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    Apply Filters
                  </button>
                  {hasAnyFilter && (
                    <button
                      onClick={onClearFilters}
                      className="px-4 py-2.5 text-sm font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Observation list */}
          <div className="flex-1 overflow-y-auto explore-sidebar-scroll">
            {observations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-stone-400 text-sm">
                <HelpCircle size={20} className="mb-2 opacity-60" />
                No observations found
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {observations.map((obs) => {
                  const isSelected = selectedId === obs.id;
                  const isResearchGrade = obs.qualityGrade === "RESEARCH_GRADE";
                  return (
                    <button
                      key={obs.id}
                      onClick={() => onSelectObservation(obs)}
                      className={`
                        w-full text-left rounded-xl overflow-hidden transition-all duration-200 cursor-pointer
                        ${
                          isSelected
                            ? "ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/10"
                            : "hover:shadow-md border border-stone-100 hover:border-stone-200"
                        }
                      `}
                    >
                      <div className="flex gap-3 p-2.5">
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                          <img
                            src={obs.thumbnailUrl || PLACEHOLDER_IMG}
                            alt={obs.species}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = PLACEHOLDER_IMG;
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3
                                className={`text-[13px] font-semibold truncate ${
                                  isSelected ? "text-emerald-700" : "text-stone-800"
                                }`}
                              >
                                {obs.species}
                              </h3>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                                  isResearchGrade
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {isResearchGrade ? "RG" : "ID"}
                              </span>
                            </div>
                            {obs.speciesScientific && (
                              <p className="text-[10px] text-stone-400 italic truncate mt-0.5">
                                {obs.speciesScientific}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[10px] text-stone-400 mt-1">
                            {obs.observedAt && (
                              <span className="flex items-center gap-0.5">
                                <Calendar size={9} />
                                {new Date(obs.observedAt).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            )}
                            <span className="flex items-center gap-0.5">
                              <MessageCircle size={9} />
                              {obs.identificationCount}
                            </span>
                            {obs.username && (
                              <span className="font-medium text-stone-500 truncate">
                                @{obs.username}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-stone-100 text-[10px] text-stone-400 text-center">
            Map data © OpenStreetMap contributors
          </div>
        </div>
      </div>
    </>
  );
}
