import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUpdateVideo } from "../../hooks/useDashboard.js";
import { getErrorMessage } from "../../utils/errorHandler.js";

function EditVideoModal({ isOpen, onClose, video }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const { mutate: updateVideo, isPending, isError, error } = useUpdateVideo();

  // Sync form state when modal opens with new video
  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setThumbnail(null);
    }
  }, [video]);

  if (!isOpen || !video) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    if (thumbnail) formData.append("thumbnail", thumbnail);

    updateVideo(
      { videoId: video._id, formData },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-white font-semibold text-lg">Edit Video</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Current thumbnail preview */}
          <div className="flex items-center gap-3">
            <img
              src={
                thumbnail ? URL.createObjectURL(thumbnail) : video.thumbnail
              }
              alt="Thumbnail"
              className="w-28 aspect-video object-cover rounded-lg bg-gray-800"
            />
            <div className="flex-1">
              <label className="text-sm text-gray-300 font-medium">
                Thumbnail
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                className="block w-full text-xs text-gray-400 mt-1 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700 file:transition file:cursor-pointer"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Video title"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500 transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm text-gray-300 font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Video description"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm outline-none border border-gray-700 focus:border-blue-500 resize-none transition"
            />
          </div>

          {/* Error */}
          {isError && (
            <p className="text-red-500 text-sm bg-red-500/10 rounded-lg px-4 py-2">
              {getErrorMessage(error)}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl font-medium transition"
            >
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVideoModal;
