"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { fetchAllObservations } from "@/app/lib/observationService";
import {
  ObservationDetailResponse,
  ObservationFilterParams,
  PageResponse,
  UserSearchResult,
} from "@/app/types/explore";
import ObservationCard from "@/app/components/observations/ObservationCard";
import { Search, Loader2, ChevronLeft, ChevronRight, User, X, Calendar } from "lucide-react";
import TaxonSearch from "@/app/components/observations/TaxonSearch";
import { userService } from "@/app/lib/userService";

const GRADES = [
  { key: "", label: "All" },
  { key: "RESEARCH_GRADE", label: "Research Grade" },
  { key: "NEEDS_ID", label: "Needs ID" },
];

export default function ObservationsPage() {
  const searchParams = useSearchParams();
  const queryAuthor = searchParams.get("author")?.trim() || "";

  const [observations, setObservations] = useState<ObservationDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Active filters
  const [filters, setFilters] = useState<ObservationFilterParams>({});

  // Pending filters (edited before apply)
  const [pendingFilters, setPendingFilters] = useState<ObservationFilterParams>({});

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
      setPendingFilters((prev) => ({ ...prev, ...partial }));
    },
    []
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

  const loadObservations = useCallback(async () => {
    setLoading(true);
    try {
      const data: PageResponse<ObservationDetailResponse> = await fetchAllObservations(page, filters);
      setObservations(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load observations:", error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    loadObservations();
  }, [loadObservations]);

  useEffect(() => {
    let ignore = false;

    const hydrateAuthorFilter = async () => {
      if (!queryAuthor) {
        return;
      }

      try {
        const matchedUser = await userService.getByUsername(queryAuthor);

        if (ignore) return;

        setPendingFilters((prev) => ({ ...prev, userId: matchedUser.id }));
        setFilters((prev) => ({ ...prev, userId: matchedUser.id }));
        setSelectedUserName(matchedUser.displayName || matchedUser.username);
        setPage(0);
      } catch {
        if (ignore) return;

        setPendingFilters((prev) => ({ ...prev, userId: undefined }));
        setFilters((prev) => ({ ...prev, userId: undefined }));
        setSelectedUserName(null);
      }
    };

    hydrateAuthorFilter();

    return () => {
      ignore = true;
    };
  }, [queryAuthor]);

  const handleApplyFilters = useCallback(() => {
    setFilters({ ...pendingFilters });
    setPage(0);
  }, [pendingFilters]);

  const handleClearFilters = useCallback(() => {
    setPendingFilters({});
    setFilters({});
    setSelectedUserName(null);
    setPage(0);
  }, []);

  const hasAnyFilter =
    !!filters.grade ||
    !!filters.taxonId ||
    !!filters.userId ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Observations</h1>
          <p className="text-stone-500 mt-1">Explore all documented sightings across the community.</p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Taxon */}
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
                  <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700 w-full h-10.5">
                    <User size={14} className="shrink-0" />
                    <span className="truncate flex-1">{selectedUserName}</span>
                    <button
                      onClick={removeUserFilter}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-200/50 hover:bg-emerald-300/60 cursor-pointer shrink-0"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="relative" ref={userRef}>
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search observer..."
                      value={userQuery}
                      onChange={(e) => {
                        setUserQuery(e.target.value);
                        setUserOpen(true);
                      }}
                      onFocus={() => userQuery.length >= 2 && setUserOpen(true)}
                      className="w-full h-10.5 pl-9 pr-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-stone-400"
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
                              <div className="text-sm font-medium text-stone-800 truncate">{u.displayName || u.username}</div>
                              <div className="text-xs text-stone-400 truncate">@{u.username}</div>
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
                <div className="grid grid-cols-2 gap-2 h-10.5">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={12} />
                    <input
                      type="date"
                      value={pendingFilters.dateFrom ? new Date(pendingFilters.dateFrom).toISOString().split("T")[0] : ""}
                      onChange={(e) => updatePending({ dateFrom: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                      className="w-full h-full pl-8 pr-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={12} />
                    <input
                      type="date"
                      value={pendingFilters.dateTo ? new Date(pendingFilters.dateTo).toISOString().split("T")[0] : ""}
                      onChange={(e) => updatePending({ dateTo: e.target.value ? new Date(e.target.value + "T23:59:59.999Z").toISOString() : undefined })}
                      className="w-full h-full pl-8 pr-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Quality Grade */}
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Quality Grade
                </div>
                <div className="flex gap-1.5 h-10.5 items-center">
                  {GRADES.map((g) => (
                    <button
                      key={g.key}
                      onClick={() => updatePending({ grade: g.key || undefined })}
                      className={`text-xs font-medium px-3 h-full rounded-xl cursor-pointer transition-all duration-200 border flex-1 ${
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
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
              {(Object.keys(pendingFilters).length > 0 || hasAnyFilter) && (
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2 text-sm font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-all cursor-pointer"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading && observations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Loading observations...</p>
          </div>
        ) : observations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
              <Search className="text-stone-400" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-1">No observations found</h3>
            <p className="text-stone-500 max-w-sm">
              We couldn&#39;t find any observations matching your filters. Try adjusting your search criteria.
            </p>
            {hasAnyFilter && (
              <button
                onClick={handleClearFilters}
                className="mt-6 text-emerald-600 font-medium hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {observations.map((obs) => (
                <ObservationCard key={obs.id} observation={obs} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                  className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-stone-600"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-medium text-stone-600 min-w-25 text-center">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1 || loading}
                  className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-stone-600"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
