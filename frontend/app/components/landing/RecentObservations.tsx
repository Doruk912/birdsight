"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { ObservationDetailResponse } from "@/app/types/explore";
import { fetchAllObservations } from "@/app/lib/observationService";
import ObservationCard from "@/app/components/observations/ObservationCard";

export default function RecentObservations() {
  const [observations, setObservations] = useState<ObservationDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllObservations(0, {})
      .then((page) => setObservations(page.content.slice(0, 6)))
      .catch(() => setObservations([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Live feed
            </span>
            <h2 className="mt-2 text-4xl font-bold text-stone-900 tracking-tight">
              Recent sightings
            </h2>
          </div>
          <Link
            href="/observations"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors group"
          >
            Browse all observations
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="text-emerald-500 animate-spin" />
          </div>
        )}

        {/* Cards grid */}
        {!loading && observations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {observations.map((obs) => (
              <ObservationCard key={obs.id} observation={obs} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && observations.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg font-medium">No observations yet.</p>
            <p className="text-sm mt-1">Be the first to log a sighting!</p>
            <Link
              href="/observations/new"
              className="inline-flex items-center gap-2 mt-6 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
            >
              Add Observation <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
