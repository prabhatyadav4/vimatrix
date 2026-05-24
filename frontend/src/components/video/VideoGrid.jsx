import VideoCard    from "./VideoCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";

// New Concept: Component composition
// VideoGrid doesn't care WHERE it's used — Home, Search, Channel page
// It only cares about: here are videos, here is a loading state
// This is what "reusable" really means

function VideoGrid({
  videos    = [],
  isLoading = false,
  skeletonCount = 12,     // how many skeletons to show while loading
  showChannel   = true,
  emptyMessage  = "No videos found.",
}) {

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {/* Array.from creates an array of N items to map over */}
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!videos.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
        {/* Unicode video camera emoji as icon — no import needed */}
        <span className="text-6xl">🎬</span>
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  // ── Video grid ────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          showChannel={showChannel}
        />
      ))}
    </div>
  );
}

export default VideoGrid;