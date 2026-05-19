import { Link } from "react-router-dom";
import { formatDuration } from "../../utils/formatDuration.js";
import { formatViews } from "../../utils/formatViews.js";
import { formatDate } from "../../utils/formatDate.js";

// New Concept: Prop destructuring with defaults
// If a prop isn't passed, use the default value after =
function VideoCard({ video, showChannel = true }) {
  // Guard: if no video data yet, render nothing
  if (!video) return null;

  const {
    _id,
    title,
    thumbnail,
    duration,
    views = 0,
    createdAt,
    channel, // joined via $lookup in getAllVideos
  } = video;

  return (
    // New Concept: group className
    // "group" on parent lets children use "group-hover:" prefix
    // When you hover the parent, children with group-hover: activate
    <div className="flex flex-col gap-3 group cursor-pointer">
      {/* ── Thumbnail ──────────────────────────────────────────────────── */}
      <Link to={`/watch/${_id}`} className="block relative">
        {/* Thumbnail image */}
        <div className="relative overflow-hidden rounded-xl aspect-video bg-gray-800">
          <img
            src={thumbnail}
            alt={title}
            // New Concept: lazy loading
            // loading="lazy" → browser only downloads image when near viewport
            // Massively improves initial page load time
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            // group-hover:scale-105 → zooms thumbnail on card hover
          />
        </div>

        {/* Duration badge — absolutely positioned bottom-right of thumbnail */}
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
            {formatDuration(duration)}
          </span>
        )}
      </Link>

      {/* ── Video Info ─────────────────────────────────────────────────── */}
      <div className="flex gap-3 px-1">
        {/* Channel avatar */}
        {showChannel && channel && (
          <Link
            to={`/channel/${channel.username}`}
            className="shrink-0 mt-0.5"
          >
            <img
              src={channel.avatar}
              alt={channel.username}
              className="w-9 h-9 rounded-full object-cover hover:opacity-90 transition"
            />
          </Link>
        )}

        {/* Text info */}
        <div className="flex-1 min-w-0">
          {/* min-w-0 allows text to truncate properly inside flex */}

          {/* Title */}
          <Link to={`/watch/${_id}`}>
            <h3 className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-blue-400 transition">
              {/* line-clamp-2 → truncate after 2 lines with "..." */}
              {title}
            </h3>
          </Link>

          {/* Channel name */}
          {showChannel && channel && (
            <Link
              to={`/channel/${channel.username}`}
              className="text-gray-400 text-xs mt-1 block hover:text-white transition"
            >
              {channel.username}
            </Link>
          )}

          {/* Views + upload date */}
          <p className="text-gray-500 text-xs mt-0.5">
            {formatViews(views)} views
            <span className="mx-1">·</span>
            {formatDate(createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
