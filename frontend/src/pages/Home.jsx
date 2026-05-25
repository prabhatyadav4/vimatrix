import React from "react";
import { useCallback } from "react";
import { useGetAllVideos } from "../hooks/useVideos.js";
import VideoGrid from "../components/video/VideoGrid.jsx";
import SkeletonCard from "../components/video/SkeletonCard.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import useInfiniteScroll from "../hooks/useInfiniteScroll.js";

function Home() {
  const {
    data, // { pages: [ page1, page2, ... ], pageParams: [...] }
    isLoading, // true only on very first fetch
    isFetchingNextPage, // true when loading page 2, 3, etc.
    hasNextPage, // false when getNextPageParam returns undefined
    fetchNextPage, // call this to load the next page
    isError,
    error,
    refetch,
  } = useGetAllVideos();

  // When sentinel div enters viewport → load next page
  // useCallback so the function reference is stable (doesn't recreate each render)
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Get the ref to attach to the sentinel div
  const sentinelRef = useInfiniteScroll(loadMore);

  // ── Flatten pages into a single videos array ───────────────────────────────
  // data.pages = [ { docs: [...] }, { docs: [...] }, ... ]
  // We need: [ ...page1.docs, ...page2.docs, ... ]
  const videos = data?.pages.flatMap((page) => page.docs) ?? [];

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <ErrorMessage
        message={error?.response?.data?.message || "Failed to load videos."}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* ── Category Filter Pills ─────────────────────────────────────────
          New Concept: horizontal scrollable row
          overflow-x-auto + flex + no wrap = horizontal scroll on mobile
      ────────────────────────────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <CategoryPill key={cat} label={cat} />
        ))}
      </div>

      {/* ── Video Grid ────────────────────────────────────────────────────── */}
      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        emptyMessage="No videos yet. Be the first to upload!"
      />

      {/* ── Infinite Scroll Sentinel ──────────────────────────────────────
          This invisible div sits at the bottom of the list.
          When it enters the viewport, useInfiniteScroll fires loadMore.
          ref={sentinelRef} attaches our IntersectionObserver to this element.
      ────────────────────────────────────────────────────────────────────── */}
      <div ref={sentinelRef} className="h-4" />

      {/* ── Loading more indicator ─────────────────────────────────────── */}
      {isFetchingNextPage && (
        <div className="py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── All videos loaded message ──────────────────────────────────── */}
      {!hasNextPage && videos.length > 0 && (
        <p className="text-center text-gray-600 text-sm py-8">
          You've seen all the videos
        </p>
      )}
    </div>
  );
}

// ── Category pill sub-component ───────────────────────────────────────────────
// New Concept: local state inside a small sub-component
// Each pill manages its own active state independently
function CategoryPill({ label }) {
  // For now this is local UI state
  // Later you can lift this to Home and use it to filter the API query
  const [active, setActive] = React.useState(label === "All");

  return (
    <button
      onClick={() => setActive((prev) => !prev)}
      className={`
        shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition
        ${
          active
            ? "bg-white text-black"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }
      `}
    >
      {label}
    </button>
  );
}

const CATEGORIES = [
  "All",
  "Gaming",
  "Music",
  "News",
  "Live",
  "Programming",
  "Sports",
  "Movies",
  "Science",
  "Travel",
];

export default Home;
