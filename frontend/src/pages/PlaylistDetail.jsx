import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Trash2, Pencil, Play } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  useGetPlaylistById,
  useRemoveVideoFromPlaylist,
  useUpdatePlaylist,
  useDeletePlaylist,
} from "../hooks/usePlaylists.js";
import { useCurrentUser } from "../hooks/useAuth.js";
import VideoCard from "../components/video/VideoCard.jsx";
import Loader from "../components/common/Loader.jsx";
import Modal from "../components/common/Modal.jsx";
import DeleteConfirmModal from "../components/dashboard/DeleteConfirmModal.jsx";
import { formatViews } from "../utils/formatViews.js";
import { formatDate } from "../utils/formatDate.js";

function PlaylistDetail() {
  const { playlistId } = useParams();
  const user = useCurrentUser();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: playlist, isLoading } = useGetPlaylistById(playlistId);
  const { mutate: removeVideo } = useRemoveVideoFromPlaylist(playlistId);
  const { mutate: deletePlaylist, isPending: isDeleting } =
    useDeletePlaylist(playlistId);

  const isOwner = user?._id === playlist?.owner?._id;

  if (isLoading) return <Loader fullScreen />;
  if (!playlist) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* ── Left: Playlist info panel ─────────────────────────────────── */}
      <aside className="lg:sticky lg:top-20 lg:self-start w-full lg:w-80 shrink-0 space-y-4">
        {/* Cover + overlay */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-800">
          {playlist.videos[0]?.thumbnail ? (
            <img
              src={playlist.videos[0].thumbnail}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play size={40} className="text-gray-600" />
            </div>
          )}
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3">
            <p className="text-white font-bold text-lg leading-tight">
              {playlist.name}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <p className="text-gray-400 text-sm">{playlist.description}</p>

          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span>
              By{" "}
              <Link
                to={`/channel/${playlist.owner?.username}`}
                className="text-white hover:text-blue-400 transition"
              >
                @{playlist.owner?.username}
              </Link>
            </span>
            <span>{playlist.videosCount} videos</span>
            <span>{formatViews(playlist.totalViews)} total views</span>
            <span>Updated {formatDate(playlist.updatedAt)}</span>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={() => setEditOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-xl border border-gray-700 transition"
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-800 hover:bg-red-900/40 text-red-400 text-sm rounded-xl border border-gray-700 transition"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </aside>

      {/* ── Right: Video list ─────────────────────────────────────────── */}
      <main className="flex-1 min-w-0">
        <h2 className="text-white font-semibold mb-4">
          Videos ({playlist.videosCount})
        </h2>

        {playlist.videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
            <Play size={48} className="text-gray-700" />
            <p>This playlist is empty.</p>
          </div>
        ) : (
          // New Concept: numbered list layout
          // Each video row = number + VideoCard + remove button
          <div className="space-y-3">
            {playlist.videos.map((video, index) => (
              <div key={video._id} className="flex items-start gap-3 group">
                {/* Index number */}
                <span className="text-gray-600 text-sm w-5 pt-1 shrink-0 text-right">
                  {index + 1}
                </span>

                {/* Horizontal video card */}
                <PlaylistVideoRow
                  video={video}
                  onRemove={isOwner ? () => removeVideo(video._id) : undefined}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit modal */}
      <EditPlaylistModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        playlist={playlist}
        playlistId={playlistId}
      />

      {/* Delete confirm modal */}
      <DeleteConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() =>
          deletePlaylist(undefined, { onSuccess: () => window.history.back() })
        }
        isPending={isDeleting}
        video={{
          title: playlist.name,
          thumbnail: playlist.videos[0]?.thumbnail,
        }}
      />
    </div>
  );
}

// Horizontal video card for playlist
function PlaylistVideoRow({ video, onRemove }) {
  return (
    <div className="flex gap-3 flex-1 min-w-0 group/row">
      <Link
        to={`/watch/${video._id}`}
        className="flex gap-3 flex-1 min-w-0 hover:opacity-90"
      >
        <div className="relative shrink-0 w-36 aspect-video rounded-lg overflow-hidden bg-gray-800">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h4 className="text-white text-sm font-medium line-clamp-2">
            {video.title}
          </h4>
          <p className="text-gray-400 text-xs mt-1">{video.owner?.username}</p>
          <p className="text-gray-500 text-xs">
            {formatViews(video.views)} views
          </p>
        </div>
      </Link>

      {/* Remove button — only visible on hover, only for owner */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover/row:opacity-100 p-2 text-gray-500 hover:text-red-400 shrink-0 transition-opacity"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}

// Edit playlist modal
function EditPlaylistModal({ isOpen, onClose, playlist, playlistId }) {
  const { mutate: update, isPending } = useUpdatePlaylist(playlistId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: playlist?.name, description: playlist?.description },
  });

  const onSubmit = (data) => {
    update(data, { onSuccess: onClose });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit playlist" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-gray-300">Name</label>
          <input
            {...register("name", { required: true })}
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500 transition"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-gray-300">Description</label>
          <textarea
            {...register("description", { required: true })}
            rows={3}
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500 resize-none transition"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 bg-gray-800 rounded-xl hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default PlaylistDetail;
