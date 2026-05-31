import { useState } from "react";
import { Plus, Check, ListVideo, Loader2 } from "lucide-react";
import Modal from "../common/Modal.jsx";
import {
  useGetUserPlaylists,
  useAddVideoToPlaylist,
  useCreatePlaylist,
} from "../../hooks/usePlaylists.js";
import { useCurrentUser } from "../../hooks/useAuth.js";

function AddToPlaylistModal({ isOpen, onClose, videoId }) {
  const user = useCurrentUser();
  const { data: playlists = [], isLoading } = useGetUserPlaylists(user?._id);
  const { mutate: addToPlaylist } = useAddVideoToPlaylist();
  const { mutate: createPlaylist, isPending: isCreating } = useCreatePlaylist();

  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [addedTo, setAddedTo] = useState(new Set());

  const handleAdd = (playlistId) => {
    if (addedTo.has(playlistId)) return;
    addToPlaylist(
      { videoId, playlistId },
      {
        onSuccess: () => {
          setAddedTo((prev) => new Set(prev).add(playlistId));
        },
      },
    );
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createPlaylist(
      { name: newName.trim(), description: "" },
      {
        onSuccess: (newPlaylist) => {
          setNewName("");
          setShowCreate(false);
          // Auto-add the video to the new playlist
          if (newPlaylist?._id) {
            addToPlaylist(
              { videoId, playlistId: newPlaylist._id },
              {
                onSuccess: () => {
                  setAddedTo((prev) => new Set(prev).add(newPlaylist._id));
                },
              },
            );
          }
        },
      },
    );
  };

  const handleClose = () => {
    setAddedTo(new Set());
    setShowCreate(false);
    setNewName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Save to playlist" size="sm">
      <div className="space-y-3">
        {/* Playlist list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        ) : playlists.length === 0 && !showCreate ? (
          <div className="text-center py-6 space-y-2">
            <ListVideo size={36} className="text-gray-700 mx-auto" />
            <p className="text-gray-400 text-sm">No playlists yet</p>
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-1 -mx-1 px-1">
            {playlists.map((playlist) => {
              const isAdded = addedTo.has(playlist._id);
              return (
                <button
                  key={playlist._id}
                  onClick={() => handleAdd(playlist._id)}
                  disabled={isAdded}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5
                    rounded-xl text-sm transition
                    ${
                      isAdded
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                        : "text-white hover:bg-gray-800 border border-transparent"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ListVideo size={16} className="text-gray-400 shrink-0" />
                    <span className="truncate">{playlist.name}</span>
                    <span className="text-gray-500 text-xs shrink-0">
                      {playlist.videosCount} videos
                    </span>
                  </div>
                  {isAdded && <Check size={16} className="text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Create new playlist inline */}
        {showCreate ? (
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Playlist name"
              autoFocus
              className="flex-1 bg-gray-800 text-white rounded-xl px-3 py-2 text-sm outline-none border border-gray-700 focus:border-blue-500 transition"
            />
            <button
              type="submit"
              disabled={isCreating || !newName.trim()}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-xl transition"
            >
              {isCreating ? "..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreate(false);
                setNewName("");
              }}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-xl transition"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl border border-dashed border-gray-700 transition"
          >
            <Plus size={16} />
            Create new playlist
          </button>
        )}
      </div>
    </Modal>
  );
}

export default AddToPlaylistModal;
