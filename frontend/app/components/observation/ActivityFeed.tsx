"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Leaf, MessageCircle } from "lucide-react";
import { IdentificationResponse, CommentResponse } from "@/app/types/explore";
import { timeAgo } from "@/app/lib/observationService";
import { useAuth } from "@/app/hooks/useAuth";

interface ActivityFeedProps {
  identifications: IdentificationResponse[];
  comments: CommentResponse[];
  onWithdrawIdentification?: (id: string) => void;
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
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-semibold border border-emerald-200">
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
  onWithdrawIdentification,
}: ActivityFeedProps) {
  const { user: currentUser } = useAuth();
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
          const isWithdrawn = id.withdrawn;
          const isNotCurrent = !id.current && !id.withdrawn;
          const isInvalid = isWithdrawn || isNotCurrent;
          const statusLabel = isWithdrawn ? "Withdrawn" : null;
          const statusDescription = isWithdrawn
            ? "Identification status: Withdrawn"
            : isNotCurrent
              ? "Identification status: Superseded"
              : "Identification is current";

          return (
            <div
              key={`id-${id.id}`}
              className={`
                flex gap-3 p-4
                ${!isLast ? "border-b border-stone-100" : ""}
                ${isInvalid ? "bg-stone-50/60" : ""}
                hover:bg-stone-50/50 transition-colors duration-150
              `}
            >
              <div className="shrink-0 relative">
                <UserAvatarSmall
                  avatarUrl={id.userAvatarUrl}
                  username={id.username}
                />
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
                  title={statusDescription}
                  aria-label={statusDescription}
                  className={`mt-2 inline-flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors group ${
                    isInvalid
                      ? "bg-stone-100 border border-stone-200 hover:bg-stone-100 hover:border-stone-300"
                      : "bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300"
                  }`}
                >
                  <TaxonThumbnail
                    coverImageUrl={id.taxonCoverImageUrl}
                    name={id.taxonCommonName || id.taxonScientificName}
                  />
                  <div className="min-w-0">
                    {id.taxonCommonName && (
                      <p
                        className={`text-sm font-semibold leading-tight ${
                          isInvalid
                            ? "text-stone-700 line-through decoration-2"
                            : "text-emerald-800 group-hover:text-emerald-900"
                        }`}
                      >
                        {id.taxonCommonName}
                      </p>
                    )}
                    <p
                      className={`text-xs italic truncate mt-0.5 ${
                        isInvalid
                          ? "text-stone-700 line-through decoration-2"
                          : "text-emerald-600"
                      }`}
                    >
                      {id.taxonScientificName}
                    </p>
                  </div>
                  <span
                    className={`ml-auto text-[10px] font-medium shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isInvalid ? "text-stone-500" : "text-emerald-500"
                    }`}
                  >
                    View →
                  </span>
                </Link>

                {/* ID comment */}
                {id.comment && (
                  <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                    {id.comment}
                  </p>
                )}

                {/* Identification status & Actions */}
                <div className="mt-1.5 flex items-center justify-between gap-3">
                  <div>
                    {statusLabel && (
                      <span
                        className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          isWithdrawn
                            ? "text-red-600 bg-red-50"
                            : "text-stone-600 bg-stone-100"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    )}
                  </div>
                  
                  {currentUser?.id === id.userId && id.current && !isWithdrawn && onWithdrawIdentification && (
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to withdraw this identification?")) {
                          onWithdrawIdentification(id.id);
                        }
                      }}
                      className="text-xs font-medium text-stone-400 hover:text-red-600 transition-colors px-2 py-1 -mr-2 rounded-md hover:bg-red-50"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
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
