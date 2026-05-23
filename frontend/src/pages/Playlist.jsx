import { useState } from "react";
import { Plus, ListVideo } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import {
  useGetUserPlaylists,
  useCreatePlaylist,
} from "../hooks/usePlaylists.js";
import { useCurrentUser } from "../hooks/useAuth.js";
import Modal from "../components/common/Modal.jsx";
import Loader from "../components/common/Loader.jsx";
import { formatDate } from "../utils/formatDate.js";

// Zod schema for creating a playlist
const createPlaylistSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  description: z.string().min(1, "Description is required.").max(500),
});

function Playlists() {
  const user = useCurrentUser();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: playlists = [], isLoading } = useGetUserPlaylists(user?._id);

  const {
    mutate: createPlaylist,
    isPending: isCreating,
    isError,
    error,
  } = useCreatePlaylist();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createPlaylistSchema) });

  const onSubmit = (data) => {
    createPlaylist(data, {
      onSuccess: () => {
        reset();
        setModalOpen(false);
      },
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <ListVideo size={20} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">Playlists</h1>
            <p className="text-gray-400 text-sm">
              {playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition"
        >
          <Plus size={16} />
          New playlist
        </button>
      </div>

      {/* Grid */}
      {playlists.length === 0 ? (
        <EmptyPlaylists onCreateClick={() => setModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist._id} playlist={playlist} />
          ))}
        </div>
      )}

      {/* Create playlist modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          reset();
        }}
        title="Create playlist"
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300">Name</label>
            <input
              {...register("name")}
              placeholder="My favourite videos"
              autoFocus
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500 transition"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-gray-300">Description</label>
            <textarea
              {...register("description")}
              placeholder="A collection of..."
              rows={3}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500 resize-none transition"
            />
            {errors.description && (
              <p className="text-red-500 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>

          {isError && (
            <p className="text-red-500 text-xs">
              {error?.response?.data?.message || "Failed to create playlist."}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                reset();
              }}
              className="px-4 py-2 text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition"
            >
              {isCreating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PlaylistCard({ playlist }) {
  return (
    <Link to={`/playlist/${playlist._id}`} className="group block">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800">
        {playlist.coverThumbnail ? (
          <img
            src={playlist.coverThumbnail}
            alt={playlist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ListVideo size={40} className="text-gray-700" />
          </div>
        )}
        {/* Video count */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/80 text-white text-xs px-2 py-1 rounded-lg">
          <ListVideo size={11} />
          {playlist.videosCount}
        </div>
      </div>
      <div className="mt-2 px-1">
        <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-blue-400 transition">
          {playlist.name}
        </h3>
        <p className="text-gray-500 text-xs mt-0.5">
          Updated {formatDate(playlist.updatedAt)}
        </p>
      </div>
    </Link>
  );
}

function EmptyPlaylists({ onCreateClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <ListVideo size={56} className="text-gray-700" />
      <div>
        <p className="text-white font-medium">No playlists yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Create your first playlist to organise your videos.
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition"
      >
        <Plus size={16} />
        Create playlist
      </button>
    </div>
  );
}

export default Playlists;
