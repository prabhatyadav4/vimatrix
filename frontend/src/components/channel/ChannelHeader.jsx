import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { useToggleSubscription } from "../../hooks/useSubscription.js";
import { useCurrentUser } from "../../hooks/useAuth.js";
import EditProfileModal from "./EditProfileModal.jsx";
import { formatViews } from "../../utils/formatViews.js";

function ChannelHeader({ channel }) {
  const currentUser = useCurrentUser();
  const isOwner = currentUser?._id === channel?._id;
  const [searchParams, setSearchParams] = useSearchParams();

  const [editOpen, setEditOpen] = useState(false);

  const { mutate: toggleSub, isPending: isSubPending } = useToggleSubscription(
    channel?._id,
  );

  return (
    <>
      {/* ── Banner ────────────────────────────────────────────────────────
          New Concept: Fallback gradient
          If user has no cover image → show a gradient instead.
          CSS gradient gives a polished look without a real image.
      ────────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-6/1 min-h-30 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {channel?.coverImage && (
          <img
            src={channel.coverImage}
            alt="Channel banner"
            className="w-full h-full object-cover"
          />
        )}

        {/* Edit banner button — top right, only for owner */}
        {isOwner && (
          <button
            onClick={() => setEditOpen(true)}
            className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 hover:bg-black/80 text-white text-xs rounded-lg backdrop-blur-sm transition"
          >
            <Pencil size={12} />
            Edit banner
          </button>
        )}
      </div>

      {/* ── Profile section ───────────────────────────────────────────────
          New Concept: Negative margin overlap
          Avatar sits at the BOTTOM of the banner and overlaps into
          the section below using -mt (negative top margin).
          The parent has padding-top equal to half the avatar size
          to make room for the overlap.

          Layout:
          ┌─────────────────────────────────────┐
          │              BANNER                  │
          │                         ┌───────────┐│
          │                         │  AVATAR   ││  ← half overlaps banner
          └─────────────────────────┤           ├┘
                                    │           │   ← half overlaps below
                                    └───────────┘
      ────────────────────────────────────────────────────────────────────── */}
      <div className="px-4 md:px-6 pt-0 pb-4">
        {/* Row: avatar + info + actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          {/* Avatar — pulled up over the banner with -mt-12 */}
          <div className="relative -mt-12 shrink-0">
            <img
              src={channel?.avatar || "/default-avatar.png"}
              alt={channel?.username}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-black"
              // ring-4 ring-black = white gap between avatar and banner
            />
            {/* Camera icon overlay — owner only */}
            {isOwner && (
              <button
                onClick={() => setEditOpen(true)}
                className="absolute bottom-0 right-0 w-8 h-8 bg-gray-800 hover:bg-gray-700 border-2 border-black rounded-full flex items-center justify-center transition"
              >
                <Pencil size={13} className="text-white" />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:mb-2">
            {isOwner ? (
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-full border border-gray-700 transition"
              >
                <Pencil size={15} />
                Edit profile
              </button>
            ) : (
              <button
                onClick={() => toggleSub()}
                disabled={isSubPending}
                className={`
                  px-6 py-2 rounded-full text-sm font-semibold transition
                  disabled:opacity-60
                  ${
                    channel?.isSubscribed
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-white hover:bg-gray-100 text-black"
                  }
                `}
              >
                {isSubPending
                  ? "..."
                  : channel?.isSubscribed
                    ? "Subscribed"
                    : "Subscribe"}
              </button>
            )}
          </div>
        </div>

        {/* Channel name + handle */}
        <div className="mt-3 space-y-1">
          <h1 className="text-white font-bold text-xl">{channel?.fullName}</h1>
          <p className="text-gray-400 text-sm">@{channel?.username}</p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
          <button
            onClick={() => setSearchParams({ tab: "subscribers" })}
            className="hover:text-blue-400 transition cursor-pointer"
          >
            <span className="text-white font-medium hover:text-blue-400 transition">
              {formatViews(channel?.subscribersCount)}
            </span>{" "}
            subscribers
          </button>
          <span>·</span>
          <button
            onClick={() => setSearchParams({ tab: "subscriptions" })}
            className="hover:text-blue-400 transition cursor-pointer"
          >
            <span className="text-white font-medium hover:text-blue-400 transition">
              {channel?.channelSubscribedToCount ?? 0}
            </span>{" "}
            subscriptions
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        user={currentUser}
      />
    </>
  );
}

export default ChannelHeader;
