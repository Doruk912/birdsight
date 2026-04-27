"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Camera, CalendarDays } from "lucide-react";
import { userService, UserResponse } from "@/app/lib/userService";
import {
  fetchUserStats,
  fetchAllObservations,
} from "@/app/lib/observationService";
import {
  UserStatsResponse,
  ObservationDetailResponse,
} from "@/app/types/explore";
import ObservationCard from "@/app/components/observations/ObservationCard";

// ── stat item ─────────────────────────────────────────────────────────────────

function StatItem({
  value,
  label,
  isLoading,
}: {
  value: string | number;
  label: string;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col items-start sm:items-center">
      {isLoading ? (
        <div className="h-7 w-12 bg-stone-200 animate-pulse rounded mb-1" />
      ) : (
        <span className="text-2xl font-bold text-stone-900 leading-none">
          {value}
        </span>
      )}
      <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider mt-1">
        {label}
      </span>
    </div>
  );
}

// ── skeleton ──────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-white pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center py-8 border-b border-stone-100 mb-10">
          <div className="h-24 w-24 rounded-full bg-stone-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-48 bg-stone-200 animate-pulse rounded-md" />
            <div className="h-4 w-32 bg-stone-200 animate-pulse rounded-md" />
            <div className="h-4 w-full max-w-lg bg-stone-200 animate-pulse rounded-md pt-2" />
          </div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <div className="h-10 w-20 bg-stone-200 animate-pulse rounded-md" />
            <div className="h-10 w-20 bg-stone-200 animate-pulse rounded-md" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div>
          <div className="h-7 w-48 bg-stone-200 animate-pulse rounded-md mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="aspect-square md:aspect-auto md:h-72 bg-stone-100 rounded-2xl" />
            <div className="aspect-square md:aspect-auto md:h-72 bg-stone-100 rounded-2xl" />
            <div className="aspect-square md:aspect-auto md:h-72 bg-stone-100 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function PublicProfilePage() {
  const params = useParams();
  const username = params?.username as string;
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [recentObs, setRecentObs] = useState<ObservationDetailResponse[]>([]);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    if (!username) return;

    setIsLoadingProfile(true);
    userService
      .getByUsername(username)
      .then((data) => {
        setProfile(data);
        return data;
      })
      .then((data) => {
        Promise.all([
          fetchUserStats(data.id).catch(() => null),
          fetchAllObservations(0, { userId: data.id }).catch(() => null),
        ])
          .then(([statsData, obsData]) => {
            if (statsData) setStats(statsData);
            if (obsData) setRecentObs(obsData.content);
          })
          .finally(() => {
            setIsLoadingData(false);
          });
      })
      .catch((err) => {
        if (err?.status === 404) setNotFoundError(true);
      })
      .finally(() => setIsLoadingProfile(false));
  }, [username]);

  if (isLoadingProfile) return <ProfileSkeleton />;

  if (notFoundError || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <AlertCircle className="text-stone-300" size={48} />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800">
            Profile Not Found
          </h2>
          <p className="text-stone-500 mt-2">
            This user doesn&#39;t exist or has been removed.
          </p>
        </div>
        <Link
          href="/"
          className="mt-6 px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white pt-16 pb-24">
      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* ── Compact Horizontal Header ────────────────────────────────────────────── */}
        <section className="flex flex-col md:flex-row gap-6 md:items-center py-8 border-b border-stone-100 mb-10">
          {/* Avatar Area */}
          <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 bg-emerald-50 ring-1 ring-stone-200 flex items-center justify-center">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName || profile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-semibold text-emerald-700">
                {(profile.displayName || profile.username)
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>

          {/* Identity & Bio */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-stone-900 truncate">
              {profile.displayName || profile.username}
            </h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
              <span>@{profile.username}</span>
              <span className="w-1 h-1 rounded-full bg-stone-300"></span>
              <span className="flex items-center gap-1.5 line-clamp-1">
                <CalendarDays size={14} /> Joined {joinedDate}
              </span>
            </div>

            {profile.bio && (
              <p className="mt-4 text-stone-700 text-sm leading-relaxed max-w-2xl line-clamp-3 md:line-clamp-none">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Stats Box */}
          <div className="flex gap-8 md:gap-12 pt-4 md:pt-0 mt-2 md:mt-0 border-t border-stone-100 md:border-none md:pl-8 md:border-l">
            <StatItem
              value={stats?.observationCount ?? 0}
              label="Observations"
              isLoading={isLoadingData}
            />
            <StatItem
              value={stats?.speciesCount ?? 0}
              label="Species"
              isLoading={isLoadingData}
            />
          </div>
        </section>

        {/* ── Recent Observations Grid ───────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900">
              Recent Observations
            </h2>
            {!isLoadingData && recentObs.length > 0 && (
              <Link
                href={{
                  pathname: "/observations",
                  query: { author: profile.username },
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors flex items-center gap-1"
                prefetch={false}
              >
                View all →
              </Link>
            )}
          </div>

          {isLoadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square md:aspect-auto md:h-72 bg-stone-100 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : recentObs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentObs.slice(0, 6).map((obs) => (
                <ObservationCard key={obs.id} observation={obs} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center bg-stone-50 rounded-2xl border border-stone-100 border-dashed">
              <Camera size={32} className="text-stone-300" strokeWidth={1.5} />
              <div>
                <p className="text-base font-semibold text-stone-700">
                  No observations yet
                </p>
                <p className="text-sm text-stone-500 mt-1 max-w-xs mx-auto">
                  {profile.username} hasn&#39;t uploaded any sightings yet.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
