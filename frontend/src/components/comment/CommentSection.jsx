import { useState, useCallback } from "react";
import { useGetVideoComments, useAddComment } from "../../hooks/useComments.js";
import { useCurrentUser } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import useInfiniteScroll from "../../hooks/useInfiniteScroll.js";
import CommentCard from "./CommentCard.jsx";
import Loader from "../common/Loader.jsx";

function CommentSection({ videoId }) {
  const user = useCurrentUser();
  const navigate = useNavigate();

  // ── Fetch comments ─────────────────────────────────────────────────────────
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetVideoComments(videoId);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useInfiniteScroll(loadMore);

  const comments = data?.pages.flatMap((p) => p.docs) ?? [];
  const totalComments = data?.pages[0]?.totalDocs ?? 0;

  // ── Add comment ────────────────────────────────────────────────────────────
  const [newComment, setNewComment] = useState("");
  const [focused, setFocused] = useState(false);

  const { mutate: addComment, isPending: isAdding } = useAddComment(videoId);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    addComment(newComment, {
      onSuccess: () => setNewComment(""),
    });
  };

  return (
    <div className="mt-6 space-y-6">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <h2 className="text-white font-semibold text-lg">
        {totalComments.toLocaleString()} Comments
      </h2>

      {/* ── Add comment form ──────────────────────────────────────────────
          New Concept: expanding textarea on focus
          When focused → show action buttons below
          When blurred with no text → collapse back
      ────────────────────────────────────────────────────────────────────── */}
      <div className="flex gap-3">
        {/* Current user's avatar */}
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt="You"
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />

        <div className="flex-1 space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => {
              if (!user) {
                navigate("/login");
                return;
              }
              setFocused(true);
            }}
            onBlur={() => {
              if (!newComment.trim()) setFocused(false);
            }}
            placeholder="Add a comment..."
            rows={focused ? 3 : 1}
            className="w-full bg-transparent text-white text-sm border-b border-gray-700 focus:border-white outline-none placeholder-gray-500 resize-none transition-all"
          />

          {/* Action buttons — only show when focused */}
          {focused && (
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setNewComment("");
                  setFocused(false);
                }}
                className="px-4 py-1.5 text-sm text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isAdding || !newComment.trim()}
                className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition"
              >
                {isAdding ? "Posting..." : "Comment"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Comments list ─────────────────────────────────────────────────── */}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              videoId={videoId}
            />
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-2" />

          {/* Loading more */}
          {isFetchingNextPage && <Loader size="sm" />}

          {/* All loaded */}
          {!hasNextPage && comments.length > 0 && (
            <p className="text-center text-gray-600 text-sm py-4">
              No more comments
            </p>
          )}

          {/* Zero comments */}
          {!isLoading && comments.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentSection;
