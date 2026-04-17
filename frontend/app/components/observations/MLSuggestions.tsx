"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Loader2, AlertTriangle, ChevronDown, ChevronUp, Info } from "lucide-react";
import { predictSpecies } from "@/app/lib/mlService";
import { MLPrediction } from "@/app/types/explore";

// Confidence thresholds
const HIGH_CONFIDENCE = 0.75; // ≥ 75%: show only top prediction as "highly confident"
const MED_CONFIDENCE = 0.40;  // 40–74%: show top 3 as "top prediction + also likely"

interface MLSuggestionsProps {
  /** The image file to classify (for new observation uploads). */
  imageFile?: File;
  /** An image URL to classify (for existing observation images). */
  imageUrl?: string;
  /** When true, the component fires the prediction. Defaults to true for upload flows. */
  triggered?: boolean;
  /** Called when the user clicks a suggestion. */
  onSelect: (taxonId: string, commonName: string | null, scientificName: string) => void;
  /** Optional CSS class for the container. */
  className?: string;
}

const DISCLAIMER =
  "AI predictions are a helpful starting point, but they're not always right. " +
  "The model hasn't been trained on every species and may not recognise rare or regional taxa. " +
  "Always verify your identification before submitting.";

export default function MLSuggestions({
  imageFile,
  imageUrl,
  triggered = true,
  onSelect,
  className = "",
}: MLSuggestionsProps) {
  const [predictions, setPredictions] = useState<MLPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const hasFiredRef = useRef(false);
  const [showDetails, setShowDetails] = useState(false);

  // Allow re-running prediction if the source image changes.
  useEffect(() => {
    hasFiredRef.current = false;
  }, [imageFile, imageUrl]);

  // Fire prediction once when triggered becomes true
  useEffect(() => {
    if (!triggered || hasFiredRef.current) return;
    if (!imageFile && !imageUrl) return;

    hasFiredRef.current = true;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(false);
      setPredictions([]);

      try {
        let file: File;
        if (imageFile) {
          file = imageFile;
        } else {
          const response = await fetch(imageUrl!);
          const blob = await response.blob();
          file = new File([blob], "observation.jpg", { type: blob.type });
        }

        const results = await predictSpecies(file);
        if (!cancelled) {
          if (results.length === 0) setError(true);
          else setPredictions(results);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [triggered, imageFile, imageUrl]);

  // Nothing to show yet
  if (!triggered && !loading && predictions.length === 0 && !error) return null;
  if (!loading && !error && predictions.length === 0) return null;

  const topPred = predictions[0];
  const topConfidence = topPred?.confidence ?? 0;
  const isHighConf = topConfidence >= HIGH_CONFIDENCE;
  const isMedConf = topConfidence >= MED_CONFIDENCE && !isHighConf;

  const displayedPredictions = isHighConf
    ? predictions.slice(0, 1)
    : isMedConf
    ? predictions.slice(0, 3)
    : predictions;

  return (
    <div className={`rounded-xl border border-violet-200 bg-violet-50/60 p-4 space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center p-1.5 bg-violet-100 rounded-lg text-violet-600 shrink-0">
          <Sparkles size={15} strokeWidth={2.5} />
        </div>
        <span className="text-sm font-bold text-violet-800 tracking-tight">
          AI Species Suggestions
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
              className="h-14 rounded-xl bg-violet-100/60 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
          <AlertTriangle size={14} />
          AI suggestions unavailable for this image
        </div>
      )}

      {/* Predictions */}
      {!loading && predictions.length > 0 && (
        <div className="space-y-2">
          {/* Contextual message */}
          {isHighConf && (
            <p className="text-xs text-violet-700 font-medium leading-snug">
              Our AI model is highly confident this is:
            </p>
          )}
          {isMedConf && (
            <p className="text-xs text-violet-700 font-medium leading-snug">
              Top AI prediction — but these species are also possible:
            </p>
          )}
          {!isHighConf && !isMedConf && (
            <p className="text-xs text-violet-700 font-medium leading-snug">
              The model is uncertain — here are its best guesses:
            </p>
          )}

          {displayedPredictions.map((pred, index) => {
            const hasValidTaxon = pred.taxonId !== null;
            const confidencePct = Math.round(pred.confidence * 100);
            const isTopPred = index === 0;

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
                  w-full text-left rounded-xl border transition-all duration-200
                  group relative overflow-hidden
                  ${isHighConf && isTopPred ? "px-4 py-3" : "px-3.5 py-2.5"}
                  ${
                    hasValidTaxon
                      ? "border-violet-200 bg-white hover:border-violet-400 hover:shadow-md cursor-pointer"
                      : "border-violet-100 bg-white/40 cursor-default opacity-60"
                  }
                `}
              >
                {/* Confidence fill bar */}
                <div
                  className={`absolute inset-y-0 left-0 ${
                    hasValidTaxon
                      ? "bg-violet-50 group-hover:bg-violet-100/60"
                      : "bg-stone-100"
                  } transition-colors duration-200 rounded-l-xl`}
                  style={{ width: showDetails ? `${confidencePct}%` : "0%" }}
                />

                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {hasValidTaxon && (
                      pred.coverImageUrl ? (
                        <img
                          src={pred.coverImageUrl}
                          alt={pred.commonName || pred.species}
                          className="w-10 h-10 rounded-lg object-cover border border-violet-200 shrink-0 bg-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0 border border-violet-200">
                          <Sparkles size={18} strokeWidth={1.5} className="text-violet-400" />
                        </div>
                      )
                    )}
                    <div className="min-w-0">
                      {pred.commonName && (
                        <p
                          className={`font-semibold text-stone-800 truncate leading-tight group-hover:text-violet-800 transition-colors ${
                            isHighConf && isTopPred ? "text-base" : "text-sm"
                          }`}
                        >
                          {pred.commonName}
                        </p>
                      )}
                      <p className="text-xs text-stone-500 italic truncate mt-0.5">
                        {pred.species}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {showDetails && (
                      <span
                        className={`text-xs font-bold tabular-nums px-2 py-0.5 rounded-full ${
                          confidencePct >= 70
                            ? "bg-emerald-100 text-emerald-700"
                            : confidencePct >= 40
                            ? "bg-amber-100 text-amber-700"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {confidencePct}%
                      </span>
                    )}
                    {hasValidTaxon && (
                      <span className="text-xs text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                        Select →
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Toggle detailed scores */}
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="flex items-center gap-1.5 text-[11px] text-violet-500 hover:text-violet-700 transition-colors font-medium mt-1"
          >
            {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showDetails ? "Hide" : "Show"} detailed confidence scores
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 pt-2 border-t border-violet-200/60">
        <Info size={13} className="text-violet-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-violet-500 leading-snug">
          {DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
