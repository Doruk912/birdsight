"use client";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface UserAvatarProps {
  avatarUrl?: string;
  displayName?: string;
  username: string;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-20 w-20 text-2xl",
  xl: "h-28 w-28 text-4xl",
};

const imageSizes: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 80,
  xl: 112,
};

function getInitials(
  displayName: string | undefined,
  username: string,
): string {
  const name = displayName || username;
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function UserAvatar({
  avatarUrl,
  displayName,
  username,
  size = "md",
}: UserAvatarProps) {
  const initials = getInitials(displayName, username);
  const px = imageSizes[size];

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={displayName || username}
        width={px}
        height={px}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${sizeClasses[size]} inline-flex items-center justify-center rounded-full bg-emerald-600 font-semibold text-white select-none shrink-0`}
    >
      {initials}
    </span>
  );
}
