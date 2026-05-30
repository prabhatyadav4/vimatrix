// src/pages/VideoWatch.jsx
import { useEffect, useState }    from "react";
import { useParams, Link }        from "react-router-dom";
import {
  Share2, ListPlus, MoreHorizontal, Eye
} from "lucide-react";
import { useGetVideoById, useGetAllVideos } from "../hooks/useVideos.js";
import { useToggleSubscription }  from "../hooks/useSubscription.js";
import { useCurrentUser }         from "../hooks/useAuth.js";
import LikeButton                 from "../components/video/LikeButton.jsx";
import CommentSection             from "../components/comment/CommentSection.jsx";
import Loader                     from "../components/common/Loader.jsx";
import ErrorMessage               from "../components/common/ErrorMessage.jsx";
import { formatViews }            from "../utils/formatViews.js";
import { formatDate }             from "../utils/formatDate.js";
import { formatDuration }         from "../utils/formatDuration.js";

function VideoWatch() {
  // Read :videoId from the URL
  const { videoId } = useParams();
  const user        = useCurrentUser();

  const {
    data: video,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetVideoById(videoId);

  const { mutate: toggleSubscription, isPending: isSubPending } =
    useToggleSubscription(video?.channel?._id);

  // ── Update page title ──────────────────────────────────────────────────────
  useEffect(() => {
    if (video?.title) {
      document.title = `${video.title} — VideoTube`;
    }
    return () => { document.title = "VideoTube"; };
  }, [video?.title]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) return <WatchPageSkeleton />;

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <ErrorMessage
        message={error?.response?.data?.message || "Failed to load video."}
        onRetry={refetch}
      />
    );
  }

  if (!video) return null;

  const isSubscribed = video.channel?.isSubscribed;

  return (
    //  Two-column layout on large screens:
    //  Left (flex-1)  = video player + info + comments
    //  Right (w-96)   = recommended videos
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-425 mx-auto">

      {/* ══════════════════════════════════════════════════════════════════
          LEFT COLUMN
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* ── Video Player ─────────────────────────────────────────────── */}
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
          <video
            src={video.videoFile}
            controls                  // native browser controls
            autoPlay                  // start playing immediately
            className="w-full h-full object-contain"
            // New Concept: onEnded event
            // You could track watch history completion here
            onEnded={() => {}}
          />
        </div>

        {/* ── Title ────────────────────────────────────────────────────── */}
        <h1 className="text-white font-semibold text-lg leading-snug">
          {video.title}
        </h1>

        {/* ── Stats + Actions row ───────────────────────────────────────
            On mobile: stack vertically
            On desktop: space-between on one row
        ────────────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* Views + date */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Eye size={16} />
            <span>{formatViews(video.views)} views</span>
            <span>·</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">

            <LikeButton
              videoId={videoId}
              likesCount={video.likesCount}
              isLikedByMe={video.isLikedByMe}
            />

            <ActionButton icon={<ListPlus size={18} />} label="Save" />
            <ActionButton icon={<Share2 size={18} />}   label="Share" />
            <ActionButton icon={<MoreHorizontal size={18} />} />

          </div>
        </div>

        {/* ── Channel info + Subscribe ──────────────────────────────────── */}
        <div className="flex items-start sm:items-center justify-between gap-4 p-4 bg-gray-900 rounded-xl">

          <Link
            to={`/channel/${video.channel?.username}`}
            className="flex items-center gap-3 group"
          >
            <img
              src={video.channel?.avatar}
              alt={video.channel?.username}
              className="w-11 h-11 rounded-full object-cover group-hover:opacity-90 transition"
            />
            <div>
              <p className="text-white font-medium group-hover:text-blue-400 transition">
                {video.channel?.fullName}
              </p>
              <p className="text-gray-400 text-sm">
                {formatViews(video.channel?.subscribersCount)} subscribers
              </p>
            </div>
          </Link>

          {/* Don't show subscribe button for own channel */}
          {user?._id !== video.channel?._id && (
            <button
              onClick={() => toggleSubscription()}
              disabled={isSubPending}
              className={`
                px-5 py-2 rounded-full text-sm font-medium transition
                disabled:opacity-60 shrink-0
                ${isSubscribed
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-white hover:bg-gray-200 text-black"
                }
              `}
            >
              {isSubPending
                ? "..."
                : isSubscribed
                  ? "Subscribed"
                  : "Subscribe"
              }
            </button>
          )}

        </div>

        {/* ── Description (expandable) ──────────────────────────────────── */}
        <ExpandableDescription description={video.description} />

        {/* ── Comments ─────────────────────────────────────────────────── */}
        <CommentSection videoId={videoId} />

      </div>

      {/* ══════════════════════════════════════════════════════════════════
          RIGHT COLUMN — Recommended videos
          hidden on mobile, visible on lg screens
      ══════════════════════════════════════════════════════════════════ */}
      <aside className="hidden lg:block w-96 shrink-0">
        <RecommendedVideos currentVideoId={videoId} />
      </aside>

    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

// Reusable action button
function ActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full text-sm font-medium border border-gray-700 transition"
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

// Expandable description
// New Concept: local boolean state to toggle between clamped and full text
function ExpandableDescription({ description }) {
  const [expanded, setExpanded] = useState(false);

  if (!description) return null;

  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <p
        className={`text-gray-300 text-sm whitespace-pre-line leading-relaxed transition-all ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {description}
      </p>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="text-white text-sm font-medium mt-2 hover:text-blue-400 transition"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}

// Recommended videos sidebar (reuses existing hooks)
function RecommendedVideos({ currentVideoId }) {
  const { data, isLoading } = useGetAllVideos();
  const videos = data?.pages
    .flatMap((p) => p.docs)
    .filter((v) => v._id !== currentVideoId)   // exclude current video
    .slice(0, 15) ?? [];                        // show max 15

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecommendedSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-white font-medium mb-4">Up next</h3>
      {videos.map((video) => (
        <RecommendedVideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}

// Compact horizontal video card for recommendations sidebar
function RecommendedVideoCard({ video }) {
  return (
    <Link to={`/watch/${video._id}`} className="flex gap-3 group">

      {/* Thumbnail — smaller, fixed size */}
      <div className="relative shrink-0 w-40 aspect-video bg-gray-800 rounded-lg overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white text-xs font-medium line-clamp-2 group-hover:text-blue-400 transition">
          {video.title}
        </h4>
        <p className="text-gray-400 text-xs mt-1">{video.channel?.username}</p>
        <p className="text-gray-500 text-xs">
          {formatViews(video.views)} views
        </p>
      </div>

    </Link>
  );
}

// Skeleton for recommended sidebar
function RecommendedSkeleton() {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="w-40 aspect-video bg-gray-800 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}

// Full page skeleton for initial load
function WatchPageSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 animate-pulse">
      <div className="flex-1 space-y-4">
        <div className="w-full aspect-video bg-gray-800 rounded-xl" />
        <div className="h-6 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
        <div className="flex gap-3 p-4 bg-gray-900 rounded-xl">
          <div className="w-11 h-11 bg-gray-800 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-800 rounded w-1/3" />
            <div className="h-3 bg-gray-800 rounded w-1/4" />
          </div>
        </div>
      </div>
      <div className="hidden lg:block w-96 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <RecommendedSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default VideoWatch;