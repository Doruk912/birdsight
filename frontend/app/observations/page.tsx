"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAllObservations } from "@/app/lib/observationService";
import {
  ObservationDetailResponse,
  ObservationFilterParams,
  PageResponse,
} from "@/app/types/explore";
import ObservationCard from "@/app/components/observations/ObservationCard";
import ObservationFilters from "@/app/components/shared/ObservationFilters";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function ObservationsPage() {
  const [observations, setObservations] = useState<ObservationDetailResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [filters, setFilters] = useState<ObservationFilterParams>({});

  // Debounced search
  const [debouncedFilters, setDebouncedFilters] =
    useState<ObservationFilterParams>({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 400);
    return () => clearTimeout(timer);
  }, [filters]);

  const loadObservations = useCallback(async () => {
    setLoading(true);
    try {
      const data: PageResponse<ObservationDetailResponse> =
        await fetchAllObservations(page, debouncedFilters);
      setObservations(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load observations:", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedFilters]);

  // Reset page to 0 when filters change
  useEffect(() => {
    setPage(0);
  }, [debouncedFilters]);

  useEffect(() => {
    loadObservations();
  }, [loadObservations]);

  const hasAnyFilter =
    !!filters.search ||
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
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
            Observations
          </h1>
          <p className="text-stone-500 mt-1">
            Explore all documented sightings across the community.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl border border-stone-200 rounded-2xl p-4 shadow-sm">
          <ObservationFilters
            filters={filters}
            onChange={setFilters}
            variant="full"
            hideBoundingBox
          />
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
            <h3 className="text-lg font-semibold text-stone-900 mb-1">
              No observations found
            </h3>
            <p className="text-stone-500 max-w-sm">
              We couldn&apos;t find any observations matching your filters. Try
              adjusting your search criteria.
            </p>
            {hasAnyFilter && (
              <button
                onClick={() => setFilters({})}
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
                <span className="text-sm font-medium text-stone-600 min-w-[100px] text-center">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
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
