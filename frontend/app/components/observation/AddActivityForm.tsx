"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Leaf, MessageCircle, Send, Loader2, Search, X} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import {
  searchTaxa,
  addComment,
  addIdentification,
} from "@/app/lib/observationService";
import {
  TaxonResponse,
  CommentResponse,
  IdentificationResponse,
  ObservationImageResponse,
} from "@/app/types/explore";
import MLSuggestions from "@/app/components/observations/MLSuggestions";

interface AddActivityFormProps {
  observationId: string;
  /** Observation images for ML prediction. */
  observationImages: ObservationImageResponse[];
  onCommentAdded: (comment: CommentResponse) => void;
  onIdentificationAdded: (identification: IdentificationResponse) => void;
}

export default function AddActivityForm({
  observationId,
  observationImages,
  onCommentAdded,
  onIdentificationAdded,
}: AddActivityFormProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"suggest_id" | "comment">("suggest_id");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Comment state
  const [commentBody, setCommentBody] = useState("");

  // ID state
  const [taxonQuery, setTaxonQuery] = useState("");
  const [taxonResults, setTaxonResults] = useState<TaxonResponse[]>([]);
  const [selectedTaxon, setSelectedTaxon] = useState<TaxonResponse | null>(null);
  const [isSearchingTaxa, setIsSearchingTaxa] = useState(false);
  const [idComment, setIdComment] = useState("");
  const taxonInputRef = useRef<HTMLInputElement>(null);

  // ML suggestion state
  const firstImageUrl = observationImages.length > 0 ? observationImages[0].imageUrl : undefined;
  const [showMlSuggestions, setShowMlSuggestions] = useState(true);

  // Debounced Taxon Search
  useEffect(() => {
    if (selectedTaxon || taxonQuery.trim().length < 2) {
      setTaxonResults([]);
      setIsSearchingTaxa(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchingTaxa(true);
      try {
        const results = await searchTaxa(taxonQuery);
        setTaxonResults(results);
      } catch (err) {
        console.error("Taxon search failed:", err);
      } finally {
        setIsSearchingTaxa(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [taxonQuery, selectedTaxon]);

  const handleMLSelect = useCallback(
    async (taxonId: string, commonName: string | null, scientificName: string) => {
      // Create a TaxonResponse-like object from ML prediction
      const taxon: TaxonResponse = {
        id: taxonId,
        scientificName,
        commonName,
        rank: "SPECIES",
        parentId: null,
      };
      setSelectedTaxon(taxon);
      setTaxonResults([]);
      setShowMlSuggestions(false);
    },
    []
  );

  if (!user) {
    return (
      <div className="bg-stone-50 border-t border-stone-100 p-6 text-center rounded-b-2xl">
        <p className="text-sm text-stone-600 mb-3">
          Sign in to add comments or suggest identifications.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newComment = await addComment(observationId, commentBody.trim());
      onCommentAdded(newComment);
      setCommentBody("");
      // activeTab remains "comment"
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaxon) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newId = await addIdentification(
        observationId,
        selectedTaxon.id,
        idComment.trim() || undefined
      );
      onIdentificationAdded(newId);
      setSelectedTaxon(null);
      setTaxonQuery("");
      setIdComment("");
      setShowMlSuggestions(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Failed to suggest identification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-50 border-t border-stone-100 rounded-b-2xl">
      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => {
            setActiveTab("suggest_id");
            setError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            activeTab === "suggest_id"
              ? "text-emerald-700 bg-white border-t-2 border-t-emerald-500 rounded-tl-2xl -mb-px"
              : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
          }`}
        >
          <Leaf size={16} />
          Suggest ID
        </button>
        <button
          onClick={() => {
            setActiveTab("comment");
            setError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            activeTab === "comment"
              ? "text-sky-700 bg-white border-t-2 border-t-sky-500 rounded-tr-2xl -mb-px"
              : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
          }`}
        >
          <MessageCircle size={16} />
          Comment
        </button>
      </div>

      <div className="p-5 bg-white rounded-b-2xl">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {activeTab === "comment" ? (
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Write a comment..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-[100px] resize-y"
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentBody.trim() || isSubmitting}
                className="inline-flex items-center gap-2 bg-sky-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                Post Comment
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleIdSubmit} className="space-y-4">
            {/* ML Suggestions */}
            {showMlSuggestions && firstImageUrl && !selectedTaxon && (
              <MLSuggestions
                imageUrl={firstImageUrl}
                onSelect={handleMLSelect}
                className="mb-2"
              />
            )}

            <div className="relative">
              {selectedTaxon ? (
                // Selected Taxon Card
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Leaf size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      {selectedTaxon.commonName && (
                        <p className="text-sm font-semibold text-emerald-900">
                          {selectedTaxon.commonName}
                        </p>
                      )}
                      <p className={`text-xs text-emerald-700 ${selectedTaxon.scientificName ? 'italic' : ''}`}>
                        {selectedTaxon.scientificName}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTaxon(null);
                      setTaxonQuery("");
                      setShowMlSuggestions(true);
                      setTimeout(() => taxonInputRef.current?.focus(), 0);
                    }}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors"
                    disabled={isSubmitting}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                // Taxon Search Input
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    ref={taxonInputRef}
                    type="text"
                    value={taxonQuery}
                    onChange={(e) => setTaxonQuery(e.target.value)}
                    placeholder="Search for a species..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                  {isSearchingTaxa && (
                    <Loader2
                      size={16}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 animate-spin"
                    />
                  )}

                  {/* Dropdown Results */}
                  {taxonResults.length > 0 && !selectedTaxon && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-lg max-h-60 overflow-y-auto py-2">
                      {taxonResults.map((taxon) => (
                        <button
                          key={taxon.id}
                          type="button"
                          onClick={() => {
                            setSelectedTaxon(taxon);
                            setTaxonResults([]);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-stone-50 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            {taxon.commonName && (
                              <p className="text-sm font-medium text-stone-800 group-hover:text-emerald-700">
                                {taxon.commonName}
                              </p>
                            )}
                            <p className="text-xs text-stone-500 italic">
                              {taxon.scientificName}
                            </p>
                          </div>
                          <span className="text-[10px] uppercase font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                            {taxon.rank}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {taxonQuery.length >= 2 &&
                    taxonResults.length === 0 &&
                    !isSearchingTaxa && (
                      <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-lg p-4 text-center text-sm text-stone-500">
                        No species found.
                      </div>
                    )}
                </div>
              )}
            </div>

            <textarea
              value={idComment}
              onChange={(e) => setIdComment(e.target.value)}
              placeholder="Add an optional comment explaining your ID..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[80px] resize-y"
              disabled={isSubmitting || !selectedTaxon}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!selectedTaxon || isSubmitting}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Leaf size={16} />
                )}
                Suggest ID
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
