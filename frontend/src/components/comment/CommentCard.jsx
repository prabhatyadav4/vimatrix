import { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { formatDate } from "../../utils/formatDate.js";
import { useCurrentUser } from "../../hooks/useAuth.js";
import { useDeleteComment, useUpdateComment } from "../../hooks/useComments.js";

function CommentCard({ comment, videoId }) {
  const user = useCurrentUser();

  // ── Edit state ─────────────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { mutate: deleteComment, isPending: isDeleting } =
    useDeleteComment(videoId);
  const { mutate: updateComment, isPending: isUpdating } =
    useUpdateComment(videoId);

  const isOwner = user?._id === comment.owner?._id;

  const handleUpdate = () => {
    if (!editedContent.trim() || editedContent === comment.content) {
      setIsEditing(false);
      return;
    }
    updateComment(
      { commentId: comment._id, content: editedContent },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleCancelEdit = () => {
    setEditedContent(comment.content); // reset to original
    setIsEditing(false);
  };

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <img
        src={comment.owner?.avatar || "/default-avatar.png"}
        alt={comment.owner?.username}
        className="w-9 h-9 rounded-full object-cover shrink-0"
      />

      <div className="flex-1 min-w-0">
        {/* Header: username + date */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white text-sm font-medium">
            @{comment.owner?.username}
          </span>
          <span className="text-gray-500 text-xs">
            {formatDate(comment.createdAt)}
          </span>
          {/* Temp comment indicator — shown before server confirms */}
          {comment._id?.startsWith("temp-") && (
            <span className="text-xs text-blue-400">Posting...</span>
          )}
        </div>

        {/* Content — switches between text and input on edit */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={2}
              className="w-full bg-gray-800 text-white text-sm rounded-lg p-2 outline-none border border-gray-700 focus:border-blue-500 resize-none transition"
              autoFocus
            />
            {/* Edit action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full transition disabled:opacity-50"
              >
                <Check size={12} />
                {isUpdating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-full transition"
              >
                <X size={12} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-sm leading-relaxed">
            {comment.content}
          </p>
        )}
      </div>

      {/* Owner actions — only visible to comment owner */}
      {isOwner && !isEditing && (
        <div className="flex items-start gap-1 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-gray-800 transition"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => deleteComment(comment._id)}
            disabled={isDeleting}
            className="p-1.5 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentCard;
