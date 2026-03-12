"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Feather,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import UserAvatar from "@/app/components/shared/UserAvatar";
import { userService, UserResponse } from "@/app/lib/userService";

// ── stat card ─────────────────────────────────────────────────────────────────

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl font-bold text-stone-800">{value}</span>
      <span className="text-xs text-stone-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ── skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-stone-200 ${className ?? ""}`} />;
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-emerald-100 to-teal-100" />
          <div className="px-8 pb-8">
            <div className="-mt-14 mb-4">
              <Skeleton className="h-28 w-28 rounded-full" />
            </div>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
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
  const { user: authUser } = useAuth();

  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    if (!username) return;
    userService
      .getByUsername(username)
      .then((data) => setProfile(data))
      .catch((err) => {
        if (err?.status === 404) setNotFoundError(true);
      })
      .finally(() => setIsLoading(false));
  }, [username]);

  if (isLoading) return <ProfileSkeleton />;

  if (notFoundError) {
    notFound();
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-stone-50">
        <AlertCircle className="text-stone-400" size={32} />
        <p className="text-stone-500 text-sm">Could not load this profile.</p>
        <Link href="/" className="text-sm text-emerald-600 hover:underline">Go home</Link>
      </div>
    );
  }

  const isOwnProfile = authUser?.username === profile.username;

  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Gradient banner seeded from username for a unique but consistent colour per user
  const bannerGradients = [
    "from-emerald-200 to-teal-300",
    "from-sky-200 to-blue-300",
    "from-violet-200 to-purple-300",
    "from-rose-200 to-pink-300",
    "from-amber-200 to-orange-300",
    "from-lime-200 to-green-300",
  ];
  const bannerIndex =
    profile.username.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    bannerGradients.length;
  const banner = bannerGradients[bannerIndex];

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <main className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* ── Hero card ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className={`h-32 bg-gradient-to-br ${banner}`} />

          <div className="px-8 pb-8">
            {/* Avatar — overlaps banner */}
            <div className="flex items-end justify-between -mt-14 mb-5">
              <div className="rounded-full ring-4 ring-white shadow-sm">
                <UserAvatar
                  avatarUrl={profile.avatarUrl}
                  displayName={profile.displayName}
                  username={profile.username}
                  size="xl"
                />
              </div>
            </div>

            {/* Name & username */}
            <h1 className="text-2xl font-bold text-stone-900 leading-tight">
              {profile.displayName || profile.username}
            </h1>
            <p className="text-sm text-stone-400 mt-0.5 mb-4">@{profile.username}</p>

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm text-stone-600 leading-relaxed mb-5 max-w-xl">
                {profile.bio}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                Joined {joinedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Feather size={13} />
                BirdSight member
              </span>
              {isOwnProfile && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {profile.email}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ── Stats row ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-sm px-8 py-6">
          <div className="grid grid-cols-3 divide-x divide-stone-100">
            <StatCard value={0} label="Observations" />
            <StatCard value={0} label="Species" />
            <StatCard value={0} label="Lifers" />
          </div>
        </section>

        {/* ── Recent activity ───────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
          <h2 className="text-sm font-semibold text-stone-700 mb-5">Recent Observations</h2>

          {/* Empty state */}
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <Feather size={24} className="text-emerald-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-stone-600">No observations yet</p>
            <p className="text-xs text-stone-400 max-w-xs">
              {isOwnProfile
                ? "Start logging your bird sightings and they'll appear here."
                : `${profile.displayName || profile.username} hasn't logged any observations yet.`}
            </p>
            {isOwnProfile && (
              <Link
                href="/"
                className="mt-1 text-xs font-semibold text-emerald-600 border border-emerald-200 rounded-lg px-4 py-2 hover:bg-emerald-50 transition-colors"
              >
                Log your first sighting
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}


