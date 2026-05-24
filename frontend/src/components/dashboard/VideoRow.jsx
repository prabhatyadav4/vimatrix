import { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import ToggleSwitch from "../common/ToggleSwitch.jsx";
import { formatViews } from "../../utils/formatViews.js";
import { formatDate } from "../../utils/formatDate.js";
import { useTogglePublish } from "../../hooks/useDashboard.js";

function VideoRow({ video, onDeleteClick }) {
  const { mutate: togglePublish, isPending } = useTogglePublish();

  return (
    // New Concept: table-row hover state
    // "group" on <tr> → cells can use group-hover: to highlight together
    <tr className="border-b border-gray-800 hover:bg-gray-900/50 transition group">
      {/* ── Thumbnail + title ─────────────────────────────────────────── */}
      <td className="py-4 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0 w-28 aspect-video rounded-lg overflow-hidden bg-gray-800">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            {/* Draft overlay */}
            {!video.isPublished && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-yellow-400 text-xs font-medium px-2 py-0.5 bg-black/60 rounded">
                  Draft
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <Link
              to={`/watch/${video._id}`}
              className="text-white text-sm font-medium line-clamp-2 hover:text-blue-400 transition"
            >
              {video.title}
            </Link>
            <p className="text-gray-500 text-xs mt-1">
              {formatDate(video.createdAt)}
            </p>
          </div>
        </div>
      </td>

      {/* ── Published toggle ──────────────────────────────────────────── */}
      <td className="py-4 px-3">
        <div className="flex flex-col items-start gap-1.5">
          <ToggleSwitch
            checked={video.isPublished}
            onChange={() => togglePublish(video._id)}
            disabled={isPending}
          />
          <span
            className={`text-xs font-medium ${
              video.isPublished ? "text-green-400" : "text-yellow-400"
            }`}
          >
            {video.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </td>

      {/* ── Views ────────────────────────────────────────────────────── */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
          <Eye size={14} />
          <span>{formatViews(video.views)}</span>
        </div>
      </td>

      {/* ── Likes ────────────────────────────────────────────────────── */}
      <td className="py-4 px-3 text-gray-400 text-sm">
        {formatViews(video.likesCount)}
      </td>

      {/* ── Actions ──────────────────────────────────────────────────── */}
      <td className="py-4 pl-3 pr-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/video/edit/${video._id}`}
            className="p-2 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition"
          >
            <Pencil size={15} />
          </Link>
          <button
            onClick={() => onDeleteClick(video)}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-700 rounded-lg transition"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default VideoRow;
