"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bird, ArrowLeft, Mail, AtSign, Pencil, Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import UserAvatar from "@/app/components/shared/UserAvatar";
import { userService } from "@/app/lib/userService";

export default function ProfilePage() {
  const { user, isLoading, updateUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please select a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5 MB.");
      return;
    }

    setIsUploading(true);
    try {
      if (!user) return;
      const updated = await userService.uploadAvatar(file);
      updateUser({ avatarUrl: updated.avatarUrl });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload avatar.";
      setUploadError(message);
    } finally {
      setIsUploading(false);
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const displayLabel = user.displayName || user.username;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top bar */}
      <header className="bg-white border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-semibold text-stone-800">
            <Bird className="text-emerald-600" size={24} strokeWidth={1.8} />
            <span className="text-lg tracking-tight">BirdSight</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Cover / gradient band */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-700" />

          <div className="px-8 pb-8">
            {/* Avatar (overlapping the cover) */}
            <div className="-mt-12 mb-6 flex items-end justify-between">
              {/* Clickable avatar with upload overlay */}
              <div className="relative group">
                <div className="rounded-full ring-4 ring-white">
                  <UserAvatar
                    avatarUrl={user.avatarUrl}
                    displayName={user.displayName}
                    username={user.username}
                    size="lg"
                  />
                </div>
                <button
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                  title="Change avatar"
                >
                  {isUploading ? (
                    <Loader2 size={20} className="text-white animate-spin" />
                  ) : (
                    <Camera size={20} className="text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <button
                className="flex items-center gap-2 text-sm font-medium text-stone-600 border border-stone-200 rounded-lg px-4 py-2 hover:bg-stone-50 transition-colors cursor-not-allowed opacity-60"
                title="Edit profile — coming soon"
                disabled
              >
                <Pencil size={14} />
                Edit Profile
              </button>
            </div>

            {/* Upload error */}
            {uploadError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {uploadError}
              </div>
            )}

            {/* Name & bio */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-stone-900">{displayLabel}</h1>
              {user.displayName && (
                <p className="flex items-center gap-1.5 text-sm text-stone-500 mt-0.5">
                  <AtSign size={13} />
                  {user.username}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="mb-8">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">
                Bio
              </h2>
              {user.bio ? (
                <p className="text-sm text-stone-600 leading-relaxed">{user.bio}</p>
              ) : (
                <p className="text-sm text-stone-400 italic">No bio yet.</p>
              )}
            </div>

            {/* Details */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
                <Mail size={16} className="text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-stone-400">Email</p>
                  <p className="text-sm font-medium text-stone-700 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
                <AtSign size={16} className="text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-stone-400">Username</p>
                  <p className="text-sm font-medium text-stone-700 truncate">{user.username}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
