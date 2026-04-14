"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { MapObservation, ObservationFilterParams } from "@/app/types/explore";
import ObservationFilters from "@/app/components/shared/ObservationFilters";

interface MapSidebarProps {
  observations: MapObservation[];
  selectedId: string | null;
  onSelectObservation: (obs: MapObservation) => void;
  filters: ObservationFilterParams;
  onFiltersChange: (filters: ObservationFilterParams) => void;
}

export default function MapSidebar({
  observations,
  selectedId,
  onSelectObservation,
  filters,
  onFiltersChange,
}: MapSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Toggle button — always visible */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className={`
          absolute top-3 z-20 flex items-center justify-center
          w-9 h-9 rounded-lg
          bg-white/90 backdrop-blur-md border border-stone-200
          shadow-md hover:bg-white
          text-stone-600 hover:text-stone-900
          transition-all duration-300 cursor-pointer
          ${collapsed ? "left-3" : "left-[332px]"}
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
        <div className="w-[320px] h-full bg-white/90 backdrop-blur-xl border-r border-stone-200 flex flex-col shadow-xl">
          {/* Header with filters */}
          <div className="px-4 pt-4 pb-3 border-b border-stone-100">
            <h2 className="text-base font-semibold text-stone-800 mb-3">
              Observations
              <span className="ml-2 text-xs font-normal text-stone-400">
                {observations.length} results
              </span>
            </h2>

            {/* Shared filter component (compact variant) */}
            <ObservationFilters
              filters={filters}
              onChange={onFiltersChange}
              variant="compact"
              hideBoundingBox
            />
          </div>

          {/* Observation list */}
          <div className="flex-1 overflow-y-auto">
            {observations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-stone-400 text-sm">
                <HelpCircle size={20} className="mb-2 opacity-60" />
                No observations found
              </div>
            ) : (
              observations.map((obs) => {
                const isSelected = selectedId === obs.id;
                const isResearchGrade = obs.qualityGrade === "RESEARCH_GRADE";
                return (
                  <button
                    key={obs.id}
                    onClick={() => onSelectObservation(obs)}
                    className={`
                      w-full text-left px-4 py-3 border-b border-stone-50
                      transition-colors duration-150 cursor-pointer
                      ${
                        isSelected
                          ? "bg-emerald-50 border-l-2 border-l-emerald-500"
                          : "hover:bg-stone-50 border-l-2 border-l-transparent"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* Quality grade icon */}
                      <span className="mt-0.5 shrink-0">
                        {isResearchGrade ? (
                          <CheckCircle2
                            size={20}
                            className="text-emerald-500"
                          />
                        ) : (
                          <HelpCircle size={20} className="text-amber-400" />
                        )}
                      </span>

                      <div className="min-w-0 flex-1">
                        {/* Species + grade badge */}
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-sm font-semibold truncate ${
                              isSelected
                                ? "text-emerald-700"
                                : "text-stone-800"
                            }`}
                          >
                            {obs.species}
                          </h3>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                              isResearchGrade
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {isResearchGrade ? "RG" : "ID"}
                          </span>
                        </div>

                        {/* Scientific name */}
                        {obs.speciesScientific && (
                          <p className="text-[11px] text-stone-400 italic truncate">
                            {obs.speciesScientific}
                          </p>
                        )}

                        {/* Location & user */}
                        <div className="flex items-center justify-between mt-1 text-[11px] text-stone-400">
                          {obs.location && (
                            <span className="flex items-center gap-0.5 truncate">
                              <MapPin size={10} className="shrink-0" />
                              {obs.location}
                            </span>
                          )}
                          {obs.user && (
                            <span className="shrink-0 ml-2 font-medium text-stone-500">
                              @{obs.user}
                            </span>
                          )}
                        </div>

                        {/* View observation link */}
                        <Link
                          href={`/observations/${obs.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          View details
                          <ExternalLink size={10} strokeWidth={2} />
                        </Link>
                      </div>
                    </div>
                  </button>
                );
              })
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
