import { ThumbsUp } from "lucide-react";
import { useToggleVideoLike } from "../../hooks/useLike.js";
import { useCurrentUser } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import { formatViews } from "../../utils/formatViews.js";

function LikeButton({ videoId, likesCount = 0, isLikedByMe = false }) {
  const { mutate: toggleLike, isPending } = useToggleVideoLike(videoId);
  const user = useCurrentUser();
  const navigate = useNavigate();

  const handleLike = () => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate("/login");
      return;
    }
    toggleLike();
    // UI updates instantly via optimistic update in the hook
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
        border transition disabled:opacity-70
        ${
          isLikedByMe
            ? "bg-blue-600 border-blue-600 text-white"
            : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
        }
      `}
    >
      {/* ThumbsUp icon — filled when liked */}
      <ThumbsUp size={18} className={isLikedByMe ? "fill-white" : ""} />
      <span>{formatViews(likesCount)}</span>
    </button>
  );
}

export default LikeButton;
