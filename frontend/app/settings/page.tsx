"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Loader2,
  Trash2,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import UserAvatar from "@/app/components/shared/UserAvatar";
import { userService } from "@/app/lib/userService";

// ── helpers ───────────────────────────────────────────────────────────────────

function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
  rightElement,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-stone-400">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-300 outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 pr-10"
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightElement}</div>
        )}
      </div>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}

function TextareaField({
  label,
  id,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-stone-400">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-300 outline-none ring-0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none"
      />
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
      {children}
    </h2>
  );
}

type ToastType = "success" | "error";

function Toast({ message, type }: { message: string; type: ToastType }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-sm ${
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 size={16} className="shrink-0" />
      ) : (
        <AlertCircle size={16} className="shrink-0" />
      )}
      {message}
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user, isLoading, updateUser, logout } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // avatar
  const [isUploading, setIsUploading] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [confirmRemoveAvatar, setConfirmRemoveAvatar] = useState(false);

  // profile fields
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // feedback
  const [profileToast, setProfileToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [passwordToast, setPasswordToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [avatarToast, setAvatarToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  // Sync form fields from user on initial load only
  const formInitialised = useRef(false);
  useEffect(() => {
    if (user && !formInitialised.current) {
      formInitialised.current = true;
      setDisplayName(user.displayName ?? "");
      setBio(user.bio ?? "");
      setEmail(user.email);
      setUsername(user.username);
    }
  }, [user]);

  // Auto-dismiss SUCCESS toasts only — error toasts persist until the next action
  useEffect(() => {
    if (!profileToast || profileToast.type !== "success") return;
    const t = setTimeout(() => setProfileToast(null), 4000);
    return () => clearTimeout(t);
  }, [profileToast]);
  useEffect(() => {
    if (!passwordToast || passwordToast.type !== "success") return;
    const t = setTimeout(() => setPasswordToast(null), 4000);
    return () => clearTimeout(t);
  }, [passwordToast]);
  useEffect(() => {
    if (!avatarToast || avatarToast.type !== "success") return;
    const t = setTimeout(() => setAvatarToast(null), 4000);
    return () => clearTimeout(t);
  }, [avatarToast]);

  // ── avatar handlers ──────────────────────────────────────────────────────

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setAvatarToast({ message: "Please select a JPEG, PNG, WebP, or GIF image.", type: "error" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarToast({ message: "Image must be smaller than 5 MB.", type: "error" });
      return;
    }

    setIsUploading(true);
    try {
      if (!user) return;
      const updated = await userService.uploadAvatar(file);
      updateUser({ avatarUrl: updated.avatarUrl });
      setAvatarToast({ message: "Photo updated successfully.", type: "success" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload photo.";
      setAvatarToast({ message, type: "error" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    setIsRemovingAvatar(true);
    try {
      await userService.deleteAvatar();
      updateUser({ avatarUrl: undefined });
      setConfirmRemoveAvatar(false);
      setAvatarToast({ message: "Photo removed.", type: "success" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to remove photo.";
      setAvatarToast({ message, type: "error" });
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  // ── profile save ─────────────────────────────────────────────────────────

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    const emailChanged = email.trim() !== user.email;
    try {
      const updated = await userService.updateProfile(user.id, {
        displayName: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        email: email.trim(),
        username: username.trim(),
      });

      setDisplayName(updated.displayName ?? "");
      setBio(updated.bio ?? "");
      setEmail(updated.email);
      setUsername(updated.username);

      updateUser({
        displayName: updated.displayName,
        bio: updated.bio,
        email: updated.email,
        username: updated.username,
      });

      if (emailChanged) {
        setProfileToast({
          message: "Email updated. For security, you'll be signed out in a moment — please sign in again with your new email.",
          type: "success",
        });
        setTimeout(() => logout(), 3000);
      } else {
        setProfileToast({ message: "Profile saved successfully.", type: "success" });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save profile.";
      setProfileToast({ message, type: "error" });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // ── password save ────────────────────────────────────────────────────────

  const handleSavePassword = async () => {
    if (!newPassword) {
      setPasswordToast({ message: "Please enter a new password.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordToast({ message: "Passwords do not match.", type: "error" });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordToast({ message: "New password must be at least 8 characters.", type: "error" });
      return;
    }
    setIsSavingPassword(true);
    try {
      await userService.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordToast({
        message: "Password changed. You'll be signed out in a moment — please sign in again with your new password.",
        type: "success",
      });
      setTimeout(() => logout(), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to change password.";
      setPasswordToast({ message, type: "error" });
    } finally {
      setIsSavingPassword(false);
    }
  };

  // ── render ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const eyeButton = (visible: boolean, toggle: () => void) => (
    <button type="button" onClick={toggle} className="text-stone-400 hover:text-stone-600 transition-colors">
      {visible ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-16">
      <main className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-stone-800">Account Settings</h1>
          <p className="text-sm text-stone-400 mt-1">Manage your photo, profile details and password.</p>
        </div>

        {/* ── Photo ────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <SectionHeading>Photo</SectionHeading>

          <div className="flex items-center gap-6">
            <div className="relative group shrink-0">
              <div className="rounded-full ring-4 ring-stone-100">
                <UserAvatar
                  avatarUrl={user.avatarUrl}
                  displayName={user.displayName}
                  username={user.username}
                  size="lg"
                />
              </div>
              <button
                onClick={handleAvatarClick}
                disabled={isUploading || isRemovingAvatar}
                className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                title="Upload new photo"
              >
                {isUploading ? (
                  <Loader2 size={18} className="text-white animate-spin" />
                ) : (
                  <Camera size={18} className="text-white" />
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

            <div className="flex flex-col gap-2">
              <button
                onClick={handleAvatarClick}
                disabled={isUploading || isRemovingAvatar}
                className="flex items-center gap-2 text-sm font-medium text-stone-700 border border-stone-200 rounded-lg px-4 py-2 hover:bg-stone-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                Upload photo
              </button>
              {user.avatarUrl && !confirmRemoveAvatar && (
                <button
                  onClick={() => setConfirmRemoveAvatar(true)}
                  disabled={isUploading || isRemovingAvatar}
                  className="flex items-center gap-2 text-sm font-medium text-red-500 border border-red-100 rounded-lg px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                  Remove photo
                </button>
              )}
              <p className="text-xs text-stone-400">JPEG, PNG, WebP or GIF · max 5 MB</p>
            </div>
          </div>

          {/* Confirm remove banner */}
          {confirmRemoveAvatar && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">Remove your profile photo? This cannot be undone.</p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setConfirmRemoveAvatar(false)}
                  disabled={isRemovingAvatar}
                  className="flex items-center gap-1.5 text-xs font-medium text-stone-600 border border-stone-200 bg-white rounded-lg px-3 py-1.5 hover:bg-stone-50 transition-colors"
                >
                  <X size={12} />
                  Cancel
                </button>
                <button
                  onClick={handleRemoveAvatar}
                  disabled={isRemovingAvatar}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg px-3 py-1.5 hover:bg-red-600 transition-colors disabled:opacity-60"
                >
                  {isRemovingAvatar ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  Yes, remove
                </button>
              </div>
            </div>
          )}

          {avatarToast && (
            <div className="mt-4">
              <Toast message={avatarToast.message} type={avatarToast.type} />
            </div>
          )}
        </section>

        {/* ── Profile info ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <SectionHeading>Profile</SectionHeading>

          <div className="flex flex-col gap-4">
            <InputField
              label="Display name"
              id="displayName"
              value={displayName}
              onChange={setDisplayName}
              placeholder="Your full name"
            />
            <InputField
              label="Username"
              id="username"
              value={username}
              onChange={setUsername}
              placeholder="username"
              hint="Used in your public profile URL."
            />
            <InputField
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              hint="Changing your email will sign you out and require you to sign in again."
            />
            <TextareaField
              label="Bio"
              id="bio"
              value={bio}
              onChange={setBio}
              placeholder="Tell the community a little about yourself…"
            />
          </div>

          {profileToast && (
            <div className="mt-4">
              <Toast message={profileToast.message} type={profileToast.type} />
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="flex items-center gap-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg px-5 py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isSavingProfile ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              Save changes
            </button>
          </div>
        </section>

        {/* ── Password ─────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <SectionHeading>Change password</SectionHeading>

          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 mb-4">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>For security, you will be signed out of all devices after changing your password and will need to sign in again.</span>
          </div>

          <div className="flex flex-col gap-4">
            <InputField
              label="Current password"
              id="currentPassword"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="••••••••"
              rightElement={eyeButton(showCurrent, () => setShowCurrent((v) => !v))}
            />
            <InputField
              label="New password"
              id="newPassword"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={setNewPassword}
              placeholder="••••••••"
              hint="At least 8 characters."
              rightElement={eyeButton(showNew, () => setShowNew((v) => !v))}
            />
            <InputField
              label="Confirm new password"
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••"
              rightElement={eyeButton(showConfirm, () => setShowConfirm((v) => !v))}
            />
          </div>

          {passwordToast && (
            <div className="mt-4">
              <Toast message={passwordToast.message} type={passwordToast.type} />
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleSavePassword}
              disabled={isSavingPassword}
              className="flex items-center gap-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg px-5 py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isSavingPassword ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
              Update password
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
