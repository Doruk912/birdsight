"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAllObservations } from "@/app/lib/observationService";
import { ObservationDetailResponse, PageResponse } from "@/app/types/explore";
import ObservationCard from "@/app/components/observations/ObservationCard";
import { Search, Filter, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function ObservationsPage() {
  const [observations, setObservations] = useState<ObservationDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filters
  const [search, setSearch] = useState("");
  const [grade, setGrade] = useState("");
  
  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const loadObservations = useCallback(async () => {
    setLoading(true);
    try {
      const data: PageResponse<ObservationDetailResponse> = await fetchAllObservations(
        page, 
        debouncedSearch, 
        grade || undefined
      );
      setObservations(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load observations:", error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, grade]);

  // Reset page to 0 when filters change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, grade]);

  useEffect(() => {
    loadObservations();
  }, [loadObservations]);

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Observations</h1>
            <p className="text-stone-500 mt-1">Explore all documented sightings across the community.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input
                type="text"
                placeholder="Search species, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
            
            {/* Grade Filter */}
            <div className="relative w-full sm:w-48 shrink-0">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-stone-700"
              >
                <option value="">All Grades</option>
                <option value="RESEARCH_GRADE">Research Grade</option>
                <option value="NEEDS_ID">Needs ID</option>
              </select>
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
              We couldn&apos;t find any observations matching your filters. Try adjusting your search term or quality grade.
            </p>
            {(search || grade) && (
              <button 
                onClick={() => { setSearch(""); setGrade(""); }}
                className="mt-6 text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
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
