"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  MapPin,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { MapObservation } from "@/app/types/explore";

interface MapSidebarProps {
  observations: MapObservation[];
  selectedId: string | null;
  onSelectObservation: (obs: MapObservation) => void;
}

type GradeFilter = "all" | "research_grade" | "needs_id";

export default function MapSidebar({
  observations,
  selectedId,
  onSelectObservation,
}: MapSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");

  const filtered = useMemo(() => {
    return observations.filter((obs) => {
      const matchesSearch =
        !search ||
        obs.species.toLowerCase().includes(search.toLowerCase()) ||
        (obs.speciesScientific?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        obs.location.toLowerCase().includes(search.toLowerCase()) ||
        obs.user.toLowerCase().includes(search.toLowerCase());

      const matchesGrade =
        gradeFilter === "all" ||
        (gradeFilter === "research_grade" && obs.qualityGrade === "RESEARCH_GRADE") ||
        (gradeFilter === "needs_id" && obs.qualityGrade === "NEEDS_ID");

      return matchesSearch && matchesGrade;
    });
  }, [observations, search, gradeFilter]);

  const grades: { key: GradeFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "research_grade", label: "Research Grade" },
    { key: "needs_id", label: "Needs ID" },
  ];

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
          {/* Header */}
          <div className="px-4 pt-4 pb-3 border-b border-stone-100">
            <h2 className="text-base font-semibold text-stone-800 mb-3">
              Observations
              <span className="ml-2 text-xs font-normal text-stone-400">
                {filtered.length} of {observations.length}
              </span>
            </h2>

            {/* Search */}
            <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 gap-2 focus-within:border-emerald-400 transition-colors">
              <Search
                size={14}
                className="text-stone-400 shrink-0"
                strokeWidth={1.8}
              />
              <input
                type="text"
                placeholder="Search species, locations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm text-stone-700 placeholder:text-stone-400 w-full"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quality grade filter pills */}
            <div className="flex gap-1.5 mt-3">
              {grades.map((g) => (
                <button
                  key={g.key}
                  onClick={() => setGradeFilter(g.key)}
                  className={`
                    text-[11px] font-medium px-2.5 py-1 rounded-full
                    transition-colors duration-200 cursor-pointer
                    ${
                      gradeFilter === g.key
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                    }
                  `}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Observation list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-stone-400 text-sm">
                <Search size={20} className="mb-2 opacity-60" />
                No observations found
              </div>
            ) : (
              filtered.map((obs) => {
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
                          <CheckCircle2 size={20} className="text-emerald-500" />
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
