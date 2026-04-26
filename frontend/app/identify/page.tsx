"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchAllObservations } from "@/app/lib/observationService";
import {
  ObservationDetailResponse,
  ObservationFilterParams,
  PageResponse,
  UserSearchResult,
} from "@/app/types/explore";
import { useAuth } from "@/app/hooks/useAuth";
import IdentifyCard from "@/app/components/identify/IdentifyCard";
import IdentifyModal from "@/app/components/identify/IdentifyModal";
import TaxonSearch from "@/app/components/observations/TaxonSearch";
import { userService } from "@/app/lib/userService";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  Calendar,
  Binoculars,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function IdentifyPage() {
  const { user, isLoading: authLoading } = useAuth();

  const [observations, setObservations] = useState<ObservationDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // "Unreviewed" toggle — default ON when logged in
  const [unreviewedOnly, setUnreviewedOnly] = useState(true);

  // Pending filter state (edited before apply)
  const [pendingFilters, setPendingFilters] = useState<ObservationFilterParams>({});
  const [activeFilters, setActiveFilters] = useState<ObservationFilterParams>({});

  // Observer user search
  const [userQuery, setUserQuery] = useState("");
  const [userResults, setUserResults] = useState<UserSearchResult[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  // Close user dropdown on outside click
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

  // Build effective filters
  const buildEffectiveFilters = useCallback(
    (base: ObservationFilterParams): ObservationFilterParams => {
      const effective: ObservationFilterParams = {
        ...base,
        grade: "NEEDS_ID",
      };
      if (unreviewedOnly && user?.id) {
        effective.notIdentifiedByUserId = user.id;
      }
      return effective;
    },
    [unreviewedOnly, user?.id]
  );

  const loadObservations = useCallback(async () => {
    if (authLoading) return;
    setLoading(true);
    try {
      const effective = buildEffectiveFilters(activeFilters);
      const data: PageResponse<ObservationDetailResponse> = await fetchAllObservations(page, effective);
      setObservations(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error("Failed to load observations for identify:", err);
    } finally {
      setLoading(false);
    }
  }, [page, activeFilters, buildEffectiveFilters, authLoading]);

  useEffect(() => {
    loadObservations();
  }, [loadObservations]);

  const handleApply = () => {
    setActiveFilters({ ...pendingFilters });
    setPage(0);
  };

  const handleClear = () => {
    setPendingFilters({});
    setActiveFilters({});
    setSelectedUserName(null);
    setPage(0);
  };

  const handleSelectUser = (u: UserSearchResult) => {
    setPendingFilters((prev) => ({ ...prev, userId: u.id }));
    setSelectedUserName(u.displayName || u.username);
    setUserQuery("");
    setUserOpen(false);
  };

  const removeUserFilter = () => {
    setPendingFilters((prev) => ({ ...prev, userId: undefined }));
    setSelectedUserName(null);
  };

  // When an observation is identified, remove it from the list
  const handleIdentified = useCallback((observationId: string) => {
    setObservations((prev) => {
      const next = prev.filter((o) => o.id !== observationId);
      setTotalElements((t) => Math.max(0, t - 1));
      return next;
    });
  }, []);

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  const hasFilters = !!(activeFilters.taxonId || activeFilters.userId || activeFilters.dateFrom || activeFilters.dateTo);

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Identify</h1>
            <p className="text-stone-500 mt-1">
              Help the community by suggesting species for unidentified sightings.
            </p>
          </div>
          {totalElements > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5 text-sm font-semibold text-amber-700 flex items-center gap-2">
              <Binoculars size={16} />
              {totalElements.toLocaleString()} observation{totalElements !== 1 ? "s" : ""} need{totalElements === 1 ? "s" : ""} ID
            </div>
          )}
        </div>

        {/* Reviewed toggle + filters */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex flex-col gap-5">

          {/* Unreviewed toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-stone-700">Show</span>
              <div className="flex gap-1 p-1 bg-stone-100 rounded-xl">
                <button
                  onClick={() => { setUnreviewedOnly(true); setPage(0); }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    unreviewedOnly
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  Unreviewed
                </button>
                <button
                  onClick={() => { setUnreviewedOnly(false); setPage(0); }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    !unreviewedOnly
                      ? "bg-white text-stone-800 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  All
                </button>
              </div>
            </div>
            {!user && !authLoading && (
              <p className="text-xs text-stone-400">
                <Link href="/login" className="text-emerald-600 font-semibold hover:underline">Sign in</Link>{" "}
                to track which observations you&#39;ve already identified.
              </p>
            )}
          </div>

          {/* Filter grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Taxon */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">Taxon</div>
              <TaxonSearch
                onSelect={(taxonId) => setPendingFilters((p) => ({ ...p, taxonId }))}
                initialTaxonId={pendingFilters.taxonId}
                label=""
                hideOptional
              />
            </div>

            {/* Observer */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">Observer</div>
              {pendingFilters.userId && selectedUserName ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700 w-full h-12">
                  <User size={14} className="shrink-0" />
                  <span className="truncate flex-1">{selectedUserName}</span>
                  <button
                    onClick={removeUserFilter}
                    className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-200/50 hover:bg-emerald-300/60"
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
                    onChange={(e) => { setUserQuery(e.target.value); setUserOpen(true); }}
                    onFocus={() => userQuery.length >= 2 && setUserOpen(true)}
                    className="w-full h-12 pl-9 pr-3 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-stone-400"
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
                            <div className="text-xs text-stone-400">@{u.username}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Date range */}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">Date Range</div>
              <div className="grid grid-cols-2 gap-2 h-12">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={12} />
                  <input
                    type="date"
                    value={pendingFilters.dateFrom ? new Date(pendingFilters.dateFrom).toISOString().split("T")[0] : ""}
                    onChange={(e) => setPendingFilters((p) => ({ ...p, dateFrom: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
                    className="w-full h-full pl-8 pr-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={12} />
                  <input
                    type="date"
                    value={pendingFilters.dateTo ? new Date(pendingFilters.dateTo).toISOString().split("T")[0] : ""}
                    onChange={(e) => setPendingFilters((p) => ({ ...p, dateTo: e.target.value ? new Date(e.target.value + "T23:59:59.999Z").toISOString() : undefined }))}
                    className="w-full h-full pl-8 pr-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
            {(Object.keys(pendingFilters).length > 0 || hasFilters) && (
              <button
                onClick={handleClear}
                className="px-5 py-2 text-sm font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-all"
              >
                Clear all
              </button>
            )}
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Content */}
        {loading && observations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Loading observations…</p>
          </div>
        ) : observations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="text-emerald-400" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-1">
              {unreviewedOnly ? "You're all caught up!" : "No observations found"}
            </h3>
            <p className="text-stone-500 max-w-sm text-sm">
              {unreviewedOnly
                ? "You've identified everything in the current filter. Switch to \"All\" to browse again."
                : "Try adjusting your filters."}
            </p>
            {unreviewedOnly && (
              <button
                onClick={() => { setUnreviewedOnly(false); setPage(0); }}
                className="mt-5 px-5 py-2 text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
              >
                Show all observations
              </button>
            )}
            {hasFilters && (
              <button
                onClick={handleClear}
                className="mt-3 text-sm text-emerald-600 font-medium hover:text-emerald-700"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {observations.map((obs, idx) => (
                <IdentifyCard
                  key={obs.id}
                  observation={obs}
                  onClick={() => openModal(idx)}
                />
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

      {/* Modal */}
      {modalOpen && observations.length > 0 && (
        <IdentifyModal
          observations={observations}
          initialIndex={modalIndex}
          onClose={() => setModalOpen(false)}
          onIdentified={handleIdentified}
        />
      )}
    </div>
  );
}
