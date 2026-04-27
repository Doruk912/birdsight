import Link from "next/link";
import { ObservationDetailResponse } from "@/app/types/explore";
import { MapPin, User, CheckCircle2 } from "lucide-react";

interface ObservationCardProps {
  observation: ObservationDetailResponse;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f5f5f4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23a8a29e'%3ENo image available%3C/text%3E%3C/svg%3E";

export default function ObservationCard({ observation }: ObservationCardProps) {
  const firstImage = observation.images?.[0]?.imageUrl || PLACEHOLDER_IMAGE;
  const taxonRank = observation.communityTaxon?.rank;
  const rankPrefix =
    taxonRank && taxonRank !== "SPECIES"
      ? taxonRank.charAt(0).toUpperCase() +
        taxonRank.slice(1).toLowerCase() +
        " "
      : "";

  const commonName = observation.communityTaxon?.commonName;
  const scientificName = observation.communityTaxon?.scientificName;

  const h1Title =
    commonName || rankPrefix + (scientificName || "Unknown species");
  const subTitle = commonName ? rankPrefix + scientificName : null;

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
    e.currentTarget.onerror = null; // Prevent infinite loop if placeholder doesn't exist
  };

  return (
    <Link
      href={`/observations/${observation.id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
        <img
          src={firstImage}
          alt={h1Title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={handleImageError}
        />
        {/* Quality Grade Badge */}
        {observation.qualityGrade === "RESEARCH_GRADE" && (
          <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-sm">
            <CheckCircle2 size={12} />
            RESEARCH
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="text-lg font-bold text-stone-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {h1Title}
          </h3>
          {subTitle && (
            <p className="text-xs italic text-stone-500 line-clamp-1 mt-0.5">
              {subTitle}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex flex-col gap-1.5 min-h-11">
            {observation.locationName && (
              <div className="flex items-start gap-1.5 text-xs text-stone-600">
                <MapPin size={14} className="shrink-0 text-stone-400 mt-0.5" />
                <span className="line-clamp-2 leading-tight">
                  {observation.locationName}
                </span>
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
                  <User size={12} className="text-stone-400" />
                </div>
              )}
              <span className="truncate max-w-25">{observation.username}</span>
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
      </div>
    </Link>
  );
}
