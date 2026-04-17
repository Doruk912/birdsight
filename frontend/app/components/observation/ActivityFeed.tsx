"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Leaf, MessageCircle } from "lucide-react";
import { IdentificationResponse, CommentResponse } from "@/app/types/explore";
import { timeAgo } from "@/app/lib/observationService";

interface ActivityFeedProps {
  identifications: IdentificationResponse[];
  comments: CommentResponse[];
}

type ActivityItem =
  | { type: "identification"; data: IdentificationResponse; createdAt: string }
  | { type: "comment"; data: CommentResponse; createdAt: string };

function UserAvatarSmall({
  avatarUrl,
  username,
}: {
  avatarUrl: string | null;
  username: string;
}) {
  return (
    <Link href={`/profile/${username}`} className="block hover:opacity-80 transition-opacity">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={username}
          className="w-9 h-9 rounded-full object-cover border border-stone-200"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-semibold border border-emerald-200">
          {username.charAt(0).toUpperCase()}
        </div>
      )}
    </Link>
  );
}

/** Small square taxon photo, or a leaf-icon placeholder */
function TaxonThumbnail({
  coverImageUrl,
  name,
}: {
  coverImageUrl: string | null | undefined;
  name: string;
}) {
  if (coverImageUrl) {
    return (
      <img
        src={coverImageUrl}
        alt={name}
        className="w-10 h-10 rounded-lg object-cover border border-emerald-200 shrink-0"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200">
      <Leaf size={16} className="text-emerald-600" strokeWidth={2} />
    </div>
  );
}

export default function ActivityFeed({
  identifications,
  comments,
}: ActivityFeedProps) {
  const items = useMemo<ActivityItem[]>(() => {
    const idItems: ActivityItem[] = identifications.map((id) => ({
      type: "identification" as const,
      data: id,
      createdAt: id.createdAt,
    }));
    const commentItems: ActivityItem[] = comments.map((c) => ({
      type: "comment" as const,
      data: c,
      createdAt: c.createdAt,
    }));

    return [...idItems, ...commentItems].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [identifications, comments]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle size={32} className="mx-auto text-stone-300 mb-3" />
        <p className="text-stone-400 text-sm">
          No identifications or comments yet.
        </p>
        <p className="text-stone-350 text-xs mt-1">
          Be the first to contribute!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (item.type === "identification") {
          const id = item.data;
          return (
            <div
              key={`id-${id.id}`}
              className={`
                flex gap-3 p-4
                ${!isLast ? "border-b border-stone-100" : ""}
                hover:bg-stone-50/50 transition-colors duration-150
              `}
            >
              {/* User avatar with ID badge */}
              <div className="shrink-0 relative">
                <UserAvatarSmall
                  avatarUrl={id.userAvatarUrl}
                  username={id.username}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                  <Leaf size={10} className="text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/profile/${id.username}`}
                    className="text-sm font-semibold text-stone-800 hover:text-emerald-600 transition-colors hover:underline"
                  >
                    {id.username}
                  </Link>
                  <span className="text-xs text-stone-400">suggested an ID</span>
                  <span className="text-[11px] text-stone-400">
                    · {timeAgo(id.createdAt)}
                  </span>
                </div>

                {/* Taxon badge — with image + clickable link */}
                <Link
                  href={`/taxonomy/${id.taxonId}`}
                  className="mt-2 inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 hover:bg-emerald-100 hover:border-emerald-300 transition-colors group"
                >
                  <TaxonThumbnail
                    coverImageUrl={id.taxonCoverImageUrl}
                    name={id.taxonCommonName || id.taxonScientificName}
                  />
                  <div className="min-w-0">
                    {id.taxonCommonName && (
                      <p className="text-sm font-semibold text-emerald-800 group-hover:text-emerald-900 leading-tight">
                        {id.taxonCommonName}
                      </p>
                    )}
                    <p className="text-xs text-emerald-600 italic truncate mt-0.5">
                      {id.taxonScientificName}
                    </p>
                  </div>
                  <span className="ml-auto text-[10px] text-emerald-500 font-medium shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </Link>

                {/* ID comment */}
                {id.comment && (
                  <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                    {id.comment}
                  </p>
                )}

                {/* Withdrawn badge */}
                {id.withdrawn && (
                  <span className="inline-block mt-1.5 text-[11px] font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                    Withdrawn
                  </span>
                )}
              </div>
            </div>
          );
        }

        // Comment item
        const comment = item.data;
        return (
          <div
            key={`comment-${comment.id}`}
            className={`
              flex gap-3 p-4
              ${!isLast ? "border-b border-stone-100" : ""}
              hover:bg-stone-50/50 transition-colors duration-150
            `}
          >
            {/* Avatar */}
            <div className="shrink-0 relative">
              <UserAvatarSmall
                avatarUrl={comment.userAvatarUrl}
                username={comment.username}
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center">
                <MessageCircle
                  size={10}
                  className="text-white"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/profile/${comment.username}`}
                  className="text-sm font-semibold text-stone-800 hover:text-emerald-600 transition-colors hover:underline"
                >
                  {comment.username}
                </Link>
                <span className="text-xs text-stone-400">commented</span>
                <span className="text-[11px] text-stone-400">
                  · {timeAgo(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">
                {comment.body}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
