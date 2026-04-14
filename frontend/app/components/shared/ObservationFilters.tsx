"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  Calendar,
  User,
  Bird,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  ObservationFilterParams,
  TaxonResponse,
  UserSearchResult,
} from "@/app/types/explore";
import { searchTaxa } from "@/app/lib/observationService";
import { userService } from "@/app/lib/userService";
import "./ObservationFilters.css";

interface ObservationFiltersProps {
  filters: ObservationFilterParams;
  onChange: (filters: ObservationFilterParams) => void;
  variant?: "full" | "compact";
  /** Hide bounding box controls (used in map page where viewport is the bbox) */
  hideBoundingBox?: boolean;
}

// Track selected display names so chips show readable text
interface SelectedMeta {
  taxonName?: string;
  taxonScientific?: string;
  taxonRank?: string;
  userName?: string;
}

const GRADES = [
  { key: "", label: "All" },
  { key: "RESEARCH_GRADE", label: "Research Grade" },
  { key: "NEEDS_ID", label: "Needs ID" },
];

function getRankBadgeClass(rank: string): string {
  switch (rank) {
    case "CLASS":
      return "rank-badge rank-badge-class";
    case "ORDER":
      return "rank-badge rank-badge-order";
    case "FAMILY":
      return "rank-badge rank-badge-family";
    case "GENUS":
      return "rank-badge rank-badge-genus";
    case "SPECIES":
      return "rank-badge rank-badge-species";
    default:
      return "rank-badge";
  }
}

export default function ObservationFilters({
  filters,
  onChange,
  variant = "full",
  hideBoundingBox = false,
}: ObservationFiltersProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedMeta, setSelectedMeta] = useState<SelectedMeta>({});

  // Taxon autocomplete
  const [taxonQuery, setTaxonQuery] = useState("");
  const [taxonResults, setTaxonResults] = useState<TaxonResponse[]>([]);
  const [taxonLoading, setTaxonLoading] = useState(false);
  const [taxonOpen, setTaxonOpen] = useState(false);
  const taxonRef = useRef<HTMLDivElement>(null);

  // User autocomplete
  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  // Debounced taxon search
  useEffect(() => {
    if (!taxonQuery || taxonQuery.trim().length < 2) {
      setTaxonResults([]);
      return;
    }
    setTaxonLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchTaxa(taxonQuery.trim());
        setTaxonResults(results);
      } catch {
        setTaxonResults([]);
      } finally {
        setTaxonLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [taxonQuery]);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (taxonRef.current && !taxonRef.current.contains(e.target as Node)) {
        setTaxonOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateFilter = useCallback(
    (partial: Partial<ObservationFilterParams>) => {
      onChange({ ...filters, ...partial });
    },
    [filters, onChange]
  );

  const clearAll = useCallback(() => {
    onChange({});
    setSelectedMeta({});
    setTaxonQuery("");
    setUserQuery("");
  }, [onChange]);

  const handleSelectTaxon = useCallback(
    (taxon: TaxonResponse) => {
      updateFilter({ taxonId: taxon.id });
      setSelectedMeta((prev) => ({
        ...prev,
        taxonName: taxon.commonName || taxon.scientificName,
        taxonScientific: taxon.scientificName,
        taxonRank: taxon.rank,
      }));
      setTaxonQuery("");
      setTaxonOpen(false);
    },
    [updateFilter]
  );

  const handleSelectUser = useCallback(
    (user: UserSearchResult) => {
      updateFilter({ userId: user.id });
      setSelectedMeta((prev) => ({
        ...prev,
        userName: user.displayName || user.username,
      }));
      setUserQuery("");
      setUserOpen(false);
    },
    [updateFilter]
  );

  const removeTaxonFilter = useCallback(() => {
    updateFilter({ taxonId: undefined });
    setSelectedMeta((prev) => ({
      ...prev,
      taxonName: undefined,
      taxonScientific: undefined,
      taxonRank: undefined,
    }));
  }, [updateFilter]);

  const removeUserFilter = useCallback(() => {
    updateFilter({ userId: undefined });
    setSelectedMeta((prev) => ({ ...prev, userName: undefined }));
  }, [updateFilter]);

  // Count active filters (excluding search/grade which are always visible)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.taxonId) count++;
    if (filters.userId) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    if (filters.grade) count++;
    return count;
  }, [filters]);

  const hasAnyFilter =
    !!filters.search ||
    !!filters.grade ||
    !!filters.taxonId ||
    !!filters.userId ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  const isCompact = variant === "compact";

  return (
    <div className={isCompact ? "filters-compact" : ""}>
      {/* Search bar — always visible */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          size={isCompact ? 14 : 16}
        />
        <input
          type="text"
          placeholder="Search species..."
          value={filters.search || ""}
          onChange={(e) => updateFilter({ search: e.target.value || undefined })}
          className="filter-input"
        />
        {filters.search && (
          <button
            onClick={() => updateFilter({ search: undefined })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`
          mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium
          transition-all duration-200 cursor-pointer
          ${
            expanded || activeFilterCount > 0
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
          className={`transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expandable filter panel */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? "max-h-[600px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4">
          {/* Quality Grade Pills */}
          <div>
            <div className="filter-label">Quality Grade</div>
            <div className="flex gap-1.5 flex-wrap">
              {GRADES.map((g) => (
                <button
                  key={g.key}
                  onClick={() =>
                    updateFilter({
                      grade: g.key || undefined,
                    })
                  }
                  className={`grade-pill ${
                    (filters.grade || "") === g.key ? "active" : ""
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Taxon Autocomplete */}
          <div>
            <div className="filter-label">Taxon</div>
            {filters.taxonId && selectedMeta.taxonName ? (
              <div className="filter-chip">
                {selectedMeta.taxonRank && (
                  <span
                    className={getRankBadgeClass(selectedMeta.taxonRank)}
                  >
                    {selectedMeta.taxonRank}
                  </span>
                )}
                {selectedMeta.taxonName}
                <button
                  onClick={removeTaxonFilter}
                  className="filter-chip-remove"
                  aria-label="Remove taxon filter"
                >
                  <X size={10} />
                </button>
              </div>
            ) : (
              <div className="relative" ref={taxonRef}>
                <Bird
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  size={isCompact ? 13 : 14}
                />
                <input
                  type="text"
                  placeholder="Search taxon..."
                  value={taxonQuery}
                  onChange={(e) => {
                    setTaxonQuery(e.target.value);
                    setTaxonOpen(true);
                  }}
                  onFocus={() => taxonQuery.length >= 2 && setTaxonOpen(true)}
                  className="filter-input"
                />
                {taxonLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="filter-spinner" />
                  </div>
                )}
                {taxonOpen && taxonResults.length > 0 && (
                  <div className="filter-autocomplete-dropdown">
                    {taxonResults.map((t) => (
                      <div
                        key={t.id}
                        className="filter-autocomplete-item"
                        onClick={() => handleSelectTaxon(t)}
                      >
                        <span className={getRankBadgeClass(t.rank)}>
                          {t.rank}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-stone-800 truncate">
                            {t.commonName || t.scientificName}
                          </div>
                          {t.commonName && (
                            <div className="text-[11px] text-stone-400 italic truncate">
                              {t.scientificName}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Autocomplete */}
          <div>
            <div className="filter-label">Observer</div>
            {filters.userId && selectedMeta.userName ? (
              <div className="filter-chip">
                <User size={12} />
                {selectedMeta.userName}
                <button
                  onClick={removeUserFilter}
                  className="filter-chip-remove"
                  aria-label="Remove observer filter"
                >
                  <X size={10} />
                </button>
              </div>
            ) : (
              <div className="relative" ref={userRef}>
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  size={isCompact ? 13 : 14}
                />
                <input
                  type="text"
                  placeholder="Search observer..."
                  value={userQuery}
                  onChange={(e) => {
                    setUserQuery(e.target.value);
                    setUserOpen(true);
                  }}
                  onFocus={() => userQuery.length >= 2 && setUserOpen(true)}
                  className="filter-input"
                />
                {userLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="filter-spinner" />
                  </div>
                )}
                {userOpen && userResults.length > 0 && (
                  <div className="filter-autocomplete-dropdown">
                    {userResults.map((u) => (
                      <div
                        key={u.id}
                        className="filter-autocomplete-item"
                        onClick={() => handleSelectUser(u)}
                      >
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={u.username}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center">
                            <User size={14} className="text-stone-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-stone-800 truncate">
                            {u.displayName || u.username}
                          </div>
                          <div className="text-[11px] text-stone-400 truncate">
                            @{u.username}
                          </div>
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
            <div className="filter-label">Date Range</div>
            <div className={`grid gap-2 ${isCompact ? "grid-cols-1" : "grid-cols-2"}`}>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                  size={13}
                />
                <input
                  type="date"
                  value={
                    filters.dateFrom
                      ? new Date(filters.dateFrom).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateFilter({
                      dateFrom: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined,
                    })
                  }
                  className="filter-date-input pl-9"
                  placeholder="From"
                />
              </div>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                  size={13}
                />
                <input
                  type="date"
                  value={
                    filters.dateTo
                      ? new Date(filters.dateTo).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateFilter({
                      dateTo: e.target.value
                        ? new Date(
                            e.target.value + "T23:59:59.999Z"
                          ).toISOString()
                        : undefined,
                    })
                  }
                  className="filter-date-input pl-9"
                  placeholder="To"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active filter chips (shown when panel is collapsed) */}
      {!expanded && hasAnyFilter && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {filters.grade && (
            <div className="filter-chip">
              {filters.grade === "RESEARCH_GRADE"
                ? "Research Grade"
                : "Needs ID"}
              <button
                onClick={() => updateFilter({ grade: undefined })}
                className="filter-chip-remove"
              >
                <X size={10} />
              </button>
            </div>
          )}
          {filters.taxonId && selectedMeta.taxonName && (
            <div className="filter-chip">
              {selectedMeta.taxonName}
              <button
                onClick={removeTaxonFilter}
                className="filter-chip-remove"
              >
                <X size={10} />
              </button>
            </div>
          )}
          {filters.userId && selectedMeta.userName && (
            <div className="filter-chip">
              @{selectedMeta.userName}
              <button
                onClick={removeUserFilter}
                className="filter-chip-remove"
              >
                <X size={10} />
              </button>
            </div>
          )}
          {(filters.dateFrom || filters.dateTo) && (
            <div className="filter-chip">
              {filters.dateFrom
                ? new Date(filters.dateFrom).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                : "..."}
              {" – "}
              {filters.dateTo
                ? new Date(filters.dateTo).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                : "..."}
              <button
                onClick={() =>
                  updateFilter({ dateFrom: undefined, dateTo: undefined })
                }
                className="filter-chip-remove"
              >
                <X size={10} />
              </button>
            </div>
          )}
          <button
            onClick={clearAll}
            className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 ml-1 cursor-pointer transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Clear all (inside panel) */}
      {expanded && hasAnyFilter && (
        <button
          onClick={clearAll}
          className="mt-3 w-full py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
