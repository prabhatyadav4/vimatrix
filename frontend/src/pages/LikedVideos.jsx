import { ThumbsUp } from "lucide-react";
import { useGetLikedVideos } from "../hooks/useLike.js";
import VideoGrid from "../components/video/VideoGrid.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

function LikedVideos() {
  const {
    data: videos = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetLikedVideos();

  if (isError) {
    return (
      <ErrorMessage
        message={
          error?.response?.data?.message || "Failed to load liked videos."
        }
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <ThumbsUp size={20} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-white font-bold text-xl">Liked Videos</h1>
          {!isLoading && (
            <p className="text-gray-400 text-sm">
              {videos.length} video{videos.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        emptyMessage="Videos you like will appear here."
      />
    </div>
  );
}

export default LikedVideos;
