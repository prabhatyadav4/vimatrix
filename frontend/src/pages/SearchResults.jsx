import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useSearchVideos } from "../hooks/useVideos.js";
import VideoGrid from "../components/video/VideoGrid.jsx";
import SkeletonCard from "../components/video/SkeletonCard.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import useInfiniteScroll from "../hooks/useInfiniteScroll.js";

function SearchResults() {
  // New Concept: useSearchParams
  // Reads ?query=react from the URL
  // When Navbar search form submits → navigate("/search?query=react")
  // This page reads that value and fetches matching videos
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
  } = useSearchVideos(query);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useInfiniteScroll(loadMore);

  const videos = data?.pages.flatMap((p) => p.docs) ?? [];

  if (isError) {
    return (
      <ErrorMessage
        message={error?.response?.data?.message || "Search failed."}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* ── Search header ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <Search size={20} className="text-gray-400" />
        <div>
          <h1 className="text-white font-semibold">
            {isLoading ? "Searching..." : `Results for "${query}"`}
          </h1>
          {/* Show total count once we have data */}
          {!isLoading && data && (
            <p className="text-gray-500 text-sm">
              {data.pages[0]?.totalDocs ?? 0} videos found
            </p>
          )}
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        emptyMessage={`No videos found for "${query}". Try a different search.`}
      />

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-4" />

      {/* Loading more skeletons */}
      {isFetchingNextPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
