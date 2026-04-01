"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { predictSpecies } from "@/app/lib/mlService";
import { MLPrediction } from "@/app/types/explore";

interface MLSuggestionsProps {
  /** The image file to classify (for new observation uploads). */
  imageFile?: File;
  /** An image URL to classify (for existing observation images). */
  imageUrl?: string;
  /** Called when the user clicks a suggestion. */
  onSelect: (taxonId: string, commonName: string | null, scientificName: string) => void;
  /** Optional CSS class for the container. */
  className?: string;
}

export default function MLSuggestions({
  imageFile,
  imageUrl,
  onSelect,
  className = "",
}: MLSuggestionsProps) {
  const [predictions, setPredictions] = useState<MLPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Predict from a File object (new observation uploads)
  useEffect(() => {
    if (!imageFile) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(false);
      setPredictions([]);

      const results = await predictSpecies(imageFile);

      if (!cancelled) {
        if (results.length === 0) {
          setError(true);
        } else {
          setPredictions(results);
        }
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [imageFile]);

  // Predict from an image URL (existing observation images)
  useEffect(() => {
    if (!imageUrl || imageFile) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(false);
      setPredictions([]);

      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "observation.jpg", { type: blob.type });

        if (!cancelled) {
          const results = await predictSpecies(file);
          if (results.length === 0) {
            setError(true);
          } else {
            setPredictions(results);
          }
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [imageUrl, imageFile]);

  // Nothing to show
  if (!imageFile && !imageUrl) return null;
  if (!loading && !error && predictions.length === 0) return null;

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center p-1.5 bg-violet-100 rounded-lg text-violet-600">
          <Sparkles size={16} strokeWidth={2.5} />
        </div>
        <span className="text-sm font-bold text-stone-700 tracking-tight">
          AI Suggestions
        </span>
        {loading && (
          <Loader2 size={14} className="animate-spin text-violet-500 ml-auto" />
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-stone-100 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
          <AlertTriangle size={14} />
          AI suggestions unavailable
        </div>
      )}

      {/* Prediction cards */}
      {!loading && predictions.length > 0 && (
        <div className="space-y-1.5">
          {predictions.map((pred, index) => {
            const hasValidTaxon = pred.taxonId !== null;
            const confidencePct = Math.round(pred.confidence * 100);

            return (
              <button
                key={pred.species}
                type="button"
                disabled={!hasValidTaxon}
                onClick={() => {
                  if (hasValidTaxon) {
                    onSelect(pred.taxonId!, pred.commonName, pred.species);
                  }
                }}
                className={`
                  w-full text-left px-3.5 py-2.5 rounded-xl border transition-all duration-200
                  group relative overflow-hidden
                  ${
                    hasValidTaxon
                      ? "border-stone-200 bg-white hover:border-violet-300 hover:shadow-sm cursor-pointer"
                      : "border-stone-100 bg-stone-50/50 cursor-default opacity-60"
                  }
                `}
                style={{
                  animationDelay: `${index * 60}ms`,
                  animation: "fadeInUp 0.3s ease-out both",
                }}
              >
                {/* Confidence bar background */}
                <div
                  className={`absolute inset-y-0 left-0 ${
                    hasValidTaxon
                      ? "bg-violet-50 group-hover:bg-violet-100/70"
                      : "bg-stone-100"
                  } transition-colors duration-200 rounded-l-xl`}
                  style={{ width: `${confidencePct}%` }}
                />

                <div className="relative flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    {pred.commonName && (
                      <p className="text-sm font-semibold text-stone-800 truncate leading-tight group-hover:text-violet-800 transition-colors">
                        {pred.commonName}
                      </p>
                    )}
                    <p className="text-xs text-stone-500 italic truncate mt-0.5">
                      {pred.species}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold tabular-nums shrink-0 px-2 py-0.5 rounded-full ${
                      confidencePct >= 70
                        ? "bg-emerald-100 text-emerald-700"
                        : confidencePct >= 40
                        ? "bg-amber-100 text-amber-700"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {confidencePct}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
