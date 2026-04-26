"use client";

import { ObservationDetailResponse } from "@/app/types/explore";
import { MapPin, User, HelpCircle } from "lucide-react";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f5f5f4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23a8a29e'%3ENo image available%3C/text%3E%3C/svg%3E";

interface IdentifyCardProps {
  observation: ObservationDetailResponse;
  onClick: () => void;
}

export default function IdentifyCard({ observation, onClick }: IdentifyCardProps) {
  const firstImage = observation.images?.[0]?.imageUrl || PLACEHOLDER_IMAGE;

  const taxonRank = observation.communityTaxon?.rank;
  const rankPrefix =
    taxonRank && taxonRank !== "SPECIES"
      ? taxonRank.charAt(0).toUpperCase() + taxonRank.slice(1).toLowerCase() + " "
      : "";
  const commonName = observation.communityTaxon?.commonName;
  const scientificName = observation.communityTaxon?.scientificName;
  const h1Title = commonName || (rankPrefix + (scientificName || "Unknown species"));

  return (
    <button
      onClick={onClick}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative text-left w-full"
    >
      {/* Image */}
      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
        <img
          src={firstImage}
          alt={h1Title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_IMAGE;
            e.currentTarget.onerror = null;
          }}
        />
        {/* Needs ID badge */}
        <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-sm">
          <HelpCircle size={11} />
          NEEDS ID
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="text-base font-bold text-stone-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {h1Title}
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            {observation.identificationCount} ID{observation.identificationCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 min-h-8">
          {observation.locationName && (
            <div className="flex items-start gap-1.5 text-xs text-stone-500">
              <MapPin size={12} className="shrink-0 text-stone-400 mt-0.5" />
              <span className="line-clamp-1 leading-tight">{observation.locationName}</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5 font-medium truncate">
            {observation.userAvatarUrl ? (
              <img
                src={observation.userAvatarUrl}
                alt={observation.username}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
                <User size={11} className="text-stone-400" />
              </div>
            )}
            <span className="truncate max-w-24">{observation.username}</span>
          </div>
          <span className="shrink-0 tabular-nums">
            {new Date(observation.observedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </button>
  );
}
