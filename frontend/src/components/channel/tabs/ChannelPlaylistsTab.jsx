import { Link } from "react-router-dom";
import { PlaySquare } from "lucide-react";
import { useGetUserPlaylists } from "../../../hooks/usePlaylists.js";
import Loader from "../../common/Loader.jsx";

function ChannelPlaylistsTab({ userId }) {
  const { data: playlists, isLoading } = useGetUserPlaylists(userId);

  if (isLoading) return <Loader />;

  if (!playlists?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <PlaySquare size={48} className="text-gray-700" />
        <p className="text-gray-400">No playlists created yet.</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist._id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
}

// Playlist card with cover thumbnail + video count overlay
function PlaylistCard({ playlist }) {
  return (
    <Link to={`/playlist/${playlist._id}`} className="group block">
      {/* Thumbnail stack effect */}
      <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden">
        {playlist.coverThumbnail ? (
          <img
            src={playlist.coverThumbnail}
            alt={playlist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <PlaySquare size={36} className="text-gray-600" />
          </div>
        )}

        {/* Video count badge — bottom right */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/80 text-white text-xs px-2 py-1 rounded-lg">
          <PlaySquare size={12} />
          <span>{playlist.videosCount} videos</span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2 px-1">
        <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-blue-400 transition">
          {playlist.name}
        </h3>
        <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
          {playlist.description}
        </p>
      </div>
    </Link>
  );
}

export default ChannelPlaylistsTab;
