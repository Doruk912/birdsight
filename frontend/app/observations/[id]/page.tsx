"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Clock,
  Eye,
  Leaf,
  MessageCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  ObservationDetailResponse,
  IdentificationResponse,
  CommentResponse,
} from "@/app/types/explore";
import {
  fetchObservationDetail,
  fetchIdentifications,
  fetchComments,
  timeAgo,
} from "@/app/lib/observationService";
import PhotoGallery from "@/app/components/observation/PhotoGallery";
import ActivityFeed from "@/app/components/observation/ActivityFeed";
import AddActivityForm from "@/app/components/observation/AddActivityForm";
import "./observation.css";

// Dynamic import for map (no SSR)
const ObservationMiniMap = dynamic(
  () => import("@/app/components/observation/ObservationMiniMap"),
  { ssr: false, loading: () => <div className="w-full h-[250px] bg-stone-100 rounded-2xl animate-pulse" /> }
);

export default function ObservationPage() {
  const params = useParams();
  const id = params.id as string;

  const [observation, setObservation] = useState<ObservationDetailResponse | null>(null);
  const [identifications, setIdentifications] = useState<IdentificationResponse[]>([]);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    Promise.all([
      fetchObservationDetail(id),
      fetchIdentifications(id),
      fetchComments(id),
    ])
      .then(([obs, ids, cmts]) => {
        setObservation(obs);
        setIdentifications(ids);
        setComments(cmts);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load observation.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-500">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm font-medium">Loading observation…</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !observation) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-lg font-semibold text-stone-800 mb-2">
            Observation not found
          </h2>
          <p className="text-sm text-stone-500 mb-6">
            {error || "The observation you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href="/observations"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to observations
          </Link>
        </div>
      </div>
    );
  }

  const isResearchGrade = observation.qualityGrade === "RESEARCH_GRADE";
  const speciesName = observation.communityTaxon?.commonName || "Unknown species";
  const scientificName = observation.communityTaxon?.scientificName;
  const observedDate = new Date(observation.observedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleCommentAdded = (newComment: CommentResponse) => {
    setComments((prev) => [...prev, newComment]);
    // Optionally increment the comment count on the observation object
    setObservation((prev) => prev ? { ...prev, commentCount: prev.commentCount + 1 } : prev);
  };

  const handleIdentificationAdded = (newId: IdentificationResponse) => {
    setIdentifications((prev) => [...prev, newId]);
    setObservation((prev) => prev ? { ...prev, identificationCount: prev.identificationCount + 1 } : prev);
  };

  return (
    <div className="min-h-screen pt-16 bg-stone-50">


      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column — Photos + Map */}
          <div className="lg:col-span-3 space-y-6 animate-fade-in-up">
            {/* Photo gallery */}
            <PhotoGallery images={observation.images} />

            {/* Mini map */}
            <div className="observation-mini-map">
              <ObservationMiniMap
                latitude={observation.latitude}
                longitude={observation.longitude}
                locationName={observation.locationName}
              />
            </div>
          </div>

          {/* Right column — Info + Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Species header card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 animate-fade-in-up-delay-1">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Leaf size={20} className="text-emerald-600" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-bold text-stone-900 leading-tight">
                      {speciesName}
                    </h1>
                    <span
                      className={`
                        inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full
                        ${
                          isResearchGrade
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      `}
                    >
                      {isResearchGrade ? (
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                      ) : (
                        <HelpCircle size={12} strokeWidth={2.5} />
                      )}
                      {isResearchGrade ? "Research Grade" : "Needs ID"}
                    </span>
                  </div>
                  {scientificName && (
                    <p className="text-sm text-stone-400 italic mt-0.5">
                      {scientificName}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              {observation.description && (
                <p className="text-sm text-stone-600 mt-4 leading-relaxed border-t border-stone-100 pt-4">
                  {observation.description}
                </p>
              )}
            </div>

            {/* Observer card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 animate-fade-in-up-delay-2">
              <div className="flex items-center gap-3">
                {/* User avatar */}
                <Link href={`/profile/${observation.username}`} className="shrink-0 hover:opacity-80 transition-opacity">
                  {observation.userAvatarUrl ? (
                    <img
                      src={observation.userAvatarUrl}
                      alt={observation.username}
                      className="w-11 h-11 rounded-full object-cover border-2 border-stone-100"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-base font-semibold border-2 border-emerald-100">
                      {observation.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <Link href={`/profile/${observation.username}`} className="hover:underline">
                    <p className="text-sm font-semibold text-stone-800 truncate">
                      {observation.username}
                    </p>
                  </Link>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-stone-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {observedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {timeAgo(observation.observedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats pills */}
            <div className="flex gap-3 animate-fade-in-up-delay-2">
              <div className="flex-1 bg-white rounded-xl border border-stone-200 shadow-sm px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 mb-1">
                  <Leaf size={14} strokeWidth={2} />
                  <span className="text-lg font-bold">
                    {observation.identificationCount}
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                  IDs
                </span>
              </div>
              <div className="flex-1 bg-white rounded-xl border border-stone-200 shadow-sm px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-sky-500 mb-1">
                  <MessageCircle size={14} strokeWidth={2} />
                  <span className="text-lg font-bold">
                    {observation.commentCount}
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                  Comments
                </span>
              </div>
              <div className="flex-1 bg-white rounded-xl border border-stone-200 shadow-sm px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-1">
                  <Eye size={14} strokeWidth={2} />
                  <span className="text-lg font-bold">
                    {observation.images.length}
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                  Photos
                </span>
              </div>
            </div>

            {/* Activity feed */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden animate-fade-in-up-delay-3 flex flex-col">
              <div className="px-5 py-4 border-b border-stone-100 flex-none">
                <h2 className="text-sm font-semibold text-stone-800">
                  Activity
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                <ActivityFeed
                  identifications={identifications}
                  comments={comments}
                />
              </div>
              <div className="flex-none mt-auto">
                <AddActivityForm 
                  observationId={observation.id}
                  onCommentAdded={handleCommentAdded}
                  onIdentificationAdded={handleIdentificationAdded}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
