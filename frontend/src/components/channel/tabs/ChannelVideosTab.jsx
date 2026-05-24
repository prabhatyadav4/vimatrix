import { useGetAllVideos } from "../../../hooks/useVideos.js";
import VideoGrid from "../../video/VideoGrid.jsx";

function ChannelVideosTab({ userId }) {
  const { data, isLoading } = useGetAllVideos({ userId });
  const videos = data?.pages.flatMap((p) => p.docs) ?? [];

  return (
    <div className="px-4 md:px-6 py-6">
      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        showChannel={false} // hide channel info — we're already on it
        emptyMessage="No videos uploaded yet."
      />
    </div>
  );
}

export default ChannelVideosTab;
