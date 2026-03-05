import { MapPin, Clock } from "lucide-react";
import { RECENT_OBSERVATIONS } from "@/app/constants/observations";

export default function RecentObservations() {
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
          <a
            href="#"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            Browse all observations →
          </a>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECENT_OBSERVATIONS.map((obs) => (
            <div
              key={obs.id}
              className="group rounded-2xl border border-stone-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              {/* Photo placeholder */}
              <div
                className={`h-44 bg-gradient-to-br ${obs.gradient} flex items-center justify-center text-6xl select-none`}
              >
                {obs.emoji}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors leading-tight">
                    {obs.species}
                  </h3>
                  {obs.badge && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${obs.badgeColor}`}
                    >
                      {obs.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-stone-500">
                  <MapPin size={12} />
                  {obs.location}
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-stone-400">
                  <span className="font-medium text-stone-600">@{obs.user}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {obs.timeAgo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
