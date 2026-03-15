"use client";

import { useState, useMemo } from "react";
import {
  Search,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  MapPin,
  Clock,
} from "lucide-react";
import { MapObservation } from "@/app/types/explore";

interface MapSidebarProps {
  observations: MapObservation[];
  selectedId: number | null;
  onSelectObservation: (obs: MapObservation) => void;
}

type BadgeFilter = "all" | "rare" | "featured" | "lifer";

export default function MapSidebar({
  observations,
  selectedId,
  onSelectObservation,
}: MapSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [badgeFilter, setBadgeFilter] = useState<BadgeFilter>("all");

  const filtered = useMemo(() => {
    return observations.filter((obs) => {
      const matchesSearch =
        !search ||
        obs.species.toLowerCase().includes(search.toLowerCase()) ||
        obs.location.toLowerCase().includes(search.toLowerCase()) ||
        obs.user.toLowerCase().includes(search.toLowerCase());

      const matchesBadge =
        badgeFilter === "all" ||
        (badgeFilter === "rare" && obs.badge === "Rare") ||
        (badgeFilter === "featured" && obs.badge === "Featured") ||
        (badgeFilter === "lifer" && obs.badge === "Lifer");

      return matchesSearch && matchesBadge;
    });
  }, [observations, search, badgeFilter]);

  const badges: { key: BadgeFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "rare", label: "Rare" },
    { key: "featured", label: "Featured" },
    { key: "lifer", label: "Lifer" },
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

            {/* Badge filter pills */}
            <div className="flex gap-1.5 mt-3">
              {badges.map((b) => (
                <button
                  key={b.key}
                  onClick={() => setBadgeFilter(b.key)}
                  className={`
                    text-[11px] font-medium px-2.5 py-1 rounded-full
                    transition-colors duration-200 cursor-pointer
                    ${
                      badgeFilter === b.key
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                    }
                  `}
                >
                  {b.label}
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
                      {/* Emoji */}
                      <span className="text-2xl leading-none mt-0.5 select-none">
                        {obs.emoji}
                      </span>

                      <div className="min-w-0 flex-1">
                        {/* Species + badge */}
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
                          {obs.badge && (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${obs.badgeColor}`}
                            >
                              {obs.badge}
                            </span>
                          )}
                        </div>

                        {/* Scientific name */}
                        {obs.speciesScientific && (
                          <p className="text-[11px] text-stone-400 italic truncate">
                            {obs.speciesScientific}
                          </p>
                        )}

                        {/* Location & time */}
                        <div className="flex items-center justify-between mt-1 text-[11px] text-stone-400">
                          <span className="flex items-center gap-0.5 truncate">
                            <MapPin size={10} className="shrink-0" />
                            {obs.location}
                          </span>
                          <span className="flex items-center gap-0.5 shrink-0 ml-2">
                            <Clock size={10} />
                            {obs.timeAgo}
                          </span>
                        </div>
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
