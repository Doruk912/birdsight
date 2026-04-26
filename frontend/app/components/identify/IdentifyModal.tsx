"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  MapPin,
  Calendar,
  Loader2,
  Leaf,
  MessageCircle,
  Send,
  Info,
} from "lucide-react";
import {
  ObservationDetailResponse,
  IdentificationResponse,
  CommentResponse,
} from "@/app/types/explore";
import {
  fetchIdentifications,
  fetchComments,
  addIdentification,
  addComment,
  timeAgo,
} from "@/app/lib/observationService";
import { useAuth } from "@/app/hooks/useAuth";
import ActivityFeed from "@/app/components/observation/ActivityFeed";
import TaxonSearch from "@/app/components/observations/TaxonSearch";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f5f5f4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23a8a29e'%3ENo image%3C/text%3E%3C/svg%3E";

interface IdentifyModalProps {
  observations: ObservationDetailResponse[];
  initialIndex: number;
  onClose: () => void;
  onIdentified: (observationId: string) => void;
}

export default function IdentifyModal({
  observations,
  initialIndex,
  onClose,
  onIdentified,
}: IdentifyModalProps) {
  const { user } = useAuth();

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [identifications, setIdentifications] = useState<IdentificationResponse[]>([]);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activeTab, setActiveTab] = useState<"suggest_id" | "comment">("suggest_id");
  const [selectedTaxonId, setSelectedTaxonId] = useState<string | undefined>(undefined);
  const [idComment, setIdComment] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [agreeSubmitting, setAgreeSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const observation = observations[currentIndex];
  const isOwnObservation = user?.id === observation?.userId;
  const hasCommunityTaxon = !!observation?.communityTaxon;
  const isResearchGrade = observation?.qualityGrade === "RESEARCH_GRADE";

  const taxonRank = observation?.communityTaxon?.rank;
  const rankPrefix =
    taxonRank && taxonRank !== "SPECIES"
      ? taxonRank.charAt(0).toUpperCase() + taxonRank.slice(1).toLowerCase() + " "
      : "";
  const commonName = observation?.communityTaxon?.commonName;
  const scientificName = observation?.communityTaxon?.scientificName;
  const displayTitle = commonName || rankPrefix + (scientificName ?? "Unknown species");
  const displaySubtitle = commonName ? rankPrefix + scientificName : null;

  const loadActivity = useCallback(async (obsId: string) => {
    setLoadingActivity(true);
    try {
      const [ids, cmts] = await Promise.all([
        fetchIdentifications(obsId),
        fetchComments(obsId),
      ]);
      setIdentifications(ids);
      setComments(cmts);
    } finally {
      setLoadingActivity(false);
    }
  }, []);

  useEffect(() => {
    if (!observation) return;
    setIdentifications([]);
    setComments([]);
    setSelectedTaxonId(undefined);
    setIdComment("");
    setCommentBody("");
    setError(null);
    setActiveTab("suggest_id");
    setPhotoIndex(0);
    loadActivity(observation.id);
  }, [observation?.id, loadActivity]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrentIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight")
        setCurrentIndex((i) => Math.min(observations.length - 1, i + 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, observations.length]);

  const advanceOrClose = () => {
    if (currentIndex < observations.length - 1) setCurrentIndex((i) => i + 1);
    else onClose();
  };

  const handleAgree = async () => {
    if (!observation?.communityTaxon || !user) return;
    setAgreeSubmitting(true);
    setError(null);
    try {
      await addIdentification(observation.id, observation.communityTaxon.id);
      onIdentified(observation.id);
      advanceOrClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to agree.");
    } finally {
      setAgreeSubmitting(false);
    }
  };

  const handleSuggestId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaxonId || !user) return;
    setSubmitting(true);
    setError(null);
    try {
      await addIdentification(observation.id, selectedTaxonId, idComment.trim() || undefined);
      onIdentified(observation.id);
      advanceOrClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit ID.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim() || !user) return;
    setSubmitting(true);
    setError(null);
    try {
      await addComment(observation.id, commentBody.trim());
      setCommentBody("");
      await loadActivity(observation.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!observation) return null;

  const images = observation.images ?? [];
  const currentImage = images[photoIndex]?.imageUrl || PLACEHOLDER;

  // Thumbnail strip height: 60px when visible, 0 when not
  const THUMB_H = images.length > 1 ? 60 : 0;
  // Left panel height = modal height (handled by parent)

  return (
    /*
      BACKDROP — clicking it closes the modal.
      No padding here so the modal can use the full viewport width.
    */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/*
        OUTER ROW
        stopPropagation prevents backdrop-close when clicking inside this row.
        max-w-7xl ensures the modal isn't too huge, leaving room for arrows.
      */}
      <div
        className="flex items-center justify-center gap-4 px-6 w-full max-w-8xl"
      >
        {/* ← Previous observation (outside modal) */}
        <button
          onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => Math.max(0, i - 1)); }}
          disabled={currentIndex === 0}
          className="flex-shrink-0 w-14 h-14 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors disabled:opacity-20 disabled:cursor-not-allowed z-50 backdrop-blur-md"
          title="Previous observation  ←"
        >
          <ChevronLeft size={32} />
        </button>

        {/*
          MODAL CARD
          - flex-1 min-w-0 to properly size between the arrows
          - explicit height via inline style (CSS min() function)
          - overflow-hidden so children can't escape
        */}
        <div
          className="flex-1 min-w-0 bg-white rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex relative"
          style={{ height: "min(860px, 90vh)" }}
          onClick={(e) => e.stopPropagation()}
        >

          {/* ══════════ LEFT PANEL — photos only ══════════ */}
          {/*
            w-[48%] so the photo gets more real estate, but leaves enough for right panel.
            flex-col with overflow-hidden so the image div
            can use flex-1 and the thumbnail strip is fixed-height.
          */}
          <div
            className="flex-shrink-0 flex flex-col overflow-hidden bg-stone-100"
            style={{ width: "48%" }}
          >
            {/*
              IMAGE AREA
              position: relative + absolute inset-0 img is the
              only correct way to make an image fill a flex-1 area
              with object-contain, because flex-1 alone doesn't give
              the img a numeric height to calculate percentages from.
            */}
            <div className="relative flex-1 overflow-hidden" style={{ minHeight: 0 }}>
              <img
                key={currentImage}          /* remount on src change for clean transition */
                src={currentImage}
                alt={`Observation photo ${photoIndex + 1}`}
                className="absolute inset-0 w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
                  e.currentTarget.onerror = null;
                }}
              />
              {images.length > 1 && (
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white text-[11px] font-semibold rounded-full tabular-nums">
                  {photoIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* THUMBNAIL STRIP (only when multiple photos) */}
            {images.length > 1 && (
              <div
                className="flex-shrink-0 flex items-center justify-center gap-2 px-4 bg-stone-200/70 border-t border-stone-200"
                style={{ height: THUMB_H }}
              >
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setPhotoIndex(i)}
                    className={`h-10 w-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${i === photoIndex
                        ? "border-emerald-500 ring-2 ring-emerald-400/30 opacity-100"
                        : "border-transparent opacity-50 hover:opacity-80 hover:border-stone-400"
                      }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={`Thumb ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ══════════ RIGHT PANEL — info + activity + actions ══════════ */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden border-l border-stone-100">

            {/* Close button — position relative to the modal card */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              style={{ position: "absolute" }}
            >
              <X size={18} />
            </button>

            {/* ─── FIXED HEADER: taxon + observer meta ─────────────────── */}
            <div className="flex-shrink-0 px-6 pt-8 pb-5 border-b border-stone-100">
              <div className="flex items-start justify-between gap-4">
                
                {/* Main Content Area */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Taxon cover image — clickable → taxon page */}
                  {observation.communityTaxon ? (
                    <Link
                      href={`/taxonomy/${observation.communityTaxon.id}`}
                      target="_blank"
                      className="shrink-0 group"
                    >
                      {observation.communityTaxon.coverImageUrl ? (
                        <img
                          src={observation.communityTaxon.coverImageUrl}
                          alt={displayTitle}
                          className="w-14 h-14 rounded-xl object-cover border border-emerald-100 group-hover:scale-105 transition-transform shadow-sm"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                          <Leaf size={24} className="text-emerald-500" />
                        </div>
                      )}
                    </Link>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                      <Leaf size={22} className="text-stone-300" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1 flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      {/* Taxon name — clickable → taxon page */}
                      {observation.communityTaxon ? (
                        <Link
                          href={`/taxonomy/${observation.communityTaxon.id}`}
                          target="_blank"
                          className="hover:underline underline-offset-2 decoration-emerald-400/60 block"
                        >
                          <h2 className="text-lg font-bold text-stone-900 leading-snug truncate">
                            {displayTitle}
                          </h2>
                        </Link>
                      ) : (
                        <h2 className="text-lg font-bold text-stone-900 leading-snug truncate">
                          {displayTitle}
                        </h2>
                      )}

                      {displaySubtitle && (
                        <p className="text-xs italic text-stone-400 mt-0.5 truncate">
                          {displaySubtitle}
                        </p>
                      )}

                      <div className="mt-2 mb-2 flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${isResearchGrade
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {isResearchGrade ? (
                            <CheckCircle2 size={9} />
                          ) : (
                            <HelpCircle size={9} />
                          )}
                          {isResearchGrade ? "Research Grade" : "Needs ID"}
                        </span>
                      </div>
                    </div>

                    {/* Integrated Observer Info (Left Aligned Block) */}
                    <div className="flex flex-col items-start text-left gap-1.5 shrink-0 text-xs text-stone-500 pt-0.5">
                      <div className="flex items-center gap-2">
                        {observation.userAvatarUrl ? (
                          <img
                            src={observation.userAvatarUrl}
                            alt={observation.username}
                            className="w-5 h-5 rounded-full object-cover border border-stone-200 shrink-0"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                            {observation.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <Link
                          href={`/profile/${observation.username}`}
                          target="_blank"
                          className="font-medium text-stone-700 hover:text-emerald-600 transition-colors"
                        >
                          {observation.username}
                        </Link>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-stone-400 shrink-0" />
                        <span>
                          {new Date(observation.observedAt).toLocaleDateString(undefined, {
                            month: "short", day: "numeric", year: "numeric",
                          })} • {timeAgo(observation.createdAt)}
                        </span>
                      </div>

                      {observation.locationName && (
                        <div className="flex items-center gap-1.5 max-w-[220px]">
                          <MapPin size={13} className="text-stone-400 shrink-0" />
                          <span className="truncate">{observation.locationName}</span>
                        </div>
                      )}

                      <Link
                        href={`/observations/${observation.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 transition-colors mt-0.5 font-medium"
                      >
                        View full observation <ExternalLink size={11} strokeWidth={2.5} />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ─── SCROLLABLE MIDDLE: unified activity ───────────── */}
            <div className="flex-1 overflow-y-auto min-h-0 pt-2">

              {/* Unified activity feed (IDs + comments merged chronologically) */}
              {loadingActivity ? (
                <div className="flex items-center gap-2 text-stone-400 text-sm px-5 py-4">
                  <Loader2 size={14} className="animate-spin" /> Loading activity…
                </div>
              ) : (
                <div>
                  <p className="px-5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    Activity · {identifications.length + comments.length}
                  </p>
                  <ActivityFeed
                    identifications={identifications}
                    comments={comments}
                  />
                </div>
              )}
            </div>

            {/* ─── PINNED BOTTOM: actions ──────────────────────────────── */}
            <div className="flex-shrink-0 border-t border-stone-100 bg-stone-50/70">
              {!user ? (
                <div className="px-5 py-4 text-center">
                  <p className="text-xs text-stone-500 mb-2">Sign in to identify observations.</p>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center h-8 px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              ) : (
                <div className="px-5 py-3 space-y-2.5">
                  {error && (
                    <div className="p-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                      {error}
                    </div>
                  )}

                  {/* Agree with community ID */}
                  {hasCommunityTaxon && !isOwnObservation && (
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-emerald-800">Agree with community ID?</p>
                        <p className="text-xs text-emerald-700 truncate">{displayTitle}</p>
                      </div>
                      <button
                        onClick={handleAgree}
                        disabled={agreeSubmitting}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {agreeSubmitting
                          ? <Loader2 size={12} className="animate-spin" />
                          : <CheckCircle2 size={12} />}
                        Agree
                      </button>
                    </div>
                  )}

                  {isOwnObservation && (
                    <div className="flex items-center gap-2 p-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-500">
                      <Info size={12} className="text-stone-400 shrink-0" />
                      This is your observation — others will identify it.
                    </div>
                  )}

                  {/* Suggest ID / Comment tabs */}
                  <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                    <div className="flex border-b border-stone-200">
                      <button
                        onClick={() => { setActiveTab("suggest_id"); setError(null); }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${activeTab === "suggest_id"
                            ? "text-emerald-700 bg-emerald-50 border-b-2 border-emerald-500 -mb-px"
                            : "text-stone-500 hover:bg-stone-50"
                          }`}
                      >
                        <Leaf size={12} /> Suggest ID
                      </button>
                      <button
                        onClick={() => { setActiveTab("comment"); setError(null); }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${activeTab === "comment"
                            ? "text-emerald-700 bg-emerald-50 border-b-2 border-emerald-500 -mb-px"
                            : "text-stone-500 hover:bg-stone-50"
                          }`}
                      >
                        <MessageCircle size={12} /> Comment
                      </button>
                    </div>

                    <div className="p-3">
                      {activeTab === "suggest_id" ? (
                        <form onSubmit={handleSuggestId} className="space-y-2">
                          <TaxonSearch onSelect={setSelectedTaxonId} label="" hideOptional />
                          <textarea
                            value={idComment}
                            onChange={(e) => setIdComment(e.target.value)}
                            placeholder="Optional note about your ID…"
                            disabled={!selectedTaxonId || submitting}
                            rows={1}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent resize-none"
                          />
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={!selectedTaxonId || submitting}
                              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submitting
                                ? <Loader2 size={12} className="animate-spin" />
                                : <Leaf size={12} />}
                              Submit ID
                            </button>
                          </div>
                        </form>
                      ) : (
                        <form onSubmit={handleComment} className="space-y-2">
                          <textarea
                            value={commentBody}
                            onChange={(e) => setCommentBody(e.target.value)}
                            placeholder="Write a comment…"
                            disabled={submitting}
                            rows={2}
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent resize-none"
                          />
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={!commentBody.trim() || submitting}
                              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submitting
                                ? <Loader2 size={12} className="animate-spin" />
                                : <Send size={12} />}
                              Post
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* → Next observation (outside modal) */}
        <button
          onClick={(e) => { e.stopPropagation(); setCurrentIndex((i) => Math.min(observations.length - 1, i + 1)); }}
          disabled={currentIndex === observations.length - 1}
          className="flex-shrink-0 w-14 h-14 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors disabled:opacity-20 disabled:cursor-not-allowed z-50 backdrop-blur-md"
          title="Next observation  →"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Observation counter below modal */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold rounded-full tabular-nums pointer-events-none select-none">
        {currentIndex + 1} / {observations.length}
      </div>
    </div>
  );
}
