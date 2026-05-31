import { ThumbsUp, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate.js";
import { useCurrentUser } from "../../hooks/useAuth.js";
import { useToggleTweetLike } from "../../hooks/useLike.js";

function TweetCard({ tweet, onDelete }) {
  const currentUser = useCurrentUser();
  const { mutate: toggleLike, isPending } = useToggleTweetLike(tweet._id);

  const isOwner = currentUser?._id === tweet.owner?._id;

  return (
    <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl flex gap-3 group relative hover:border-gray-700 transition duration-200">
      {/* User Avatar */}
      <Link to={`/channel/${tweet.owner?.username}`} className="shrink-0">
        <img
          src={tweet.owner?.avatar || "/default-avatar.png"}
          alt={tweet.owner?.username}
          className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition ring-1 ring-gray-800"
        />
      </Link>

      {/* Main Tweet Body */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Author Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              to={`/channel/${tweet.owner?.username}`}
              className="text-white text-sm font-semibold hover:text-blue-400 transition"
            >
              {tweet.owner?.fullName}
            </Link>
            <span className="text-gray-400 text-xs">@{tweet.owner?.username}</span>
            <span className="text-gray-600 text-xs">·</span>
            <span className="text-gray-500 text-xs">
              {formatDate(tweet.createdAt)}
            </span>
          </div>

          {/* Delete Button (if Owner) */}
          {isOwner && onDelete && (
            <button
              onClick={() => onDelete(tweet._id)}
              className="text-gray-600 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-red-500/10"
              title="Delete Tweet"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>

        {/* Content */}
        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
          {tweet.content}
        </p>

        {/* Like Action */}
        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={() => toggleLike()}
            disabled={isPending}
            className={`
              flex items-center gap-1.5 text-xs font-medium transition cursor-pointer
              ${
                tweet.isLikedByMe
                  ? "text-blue-400 hover:text-blue-500"
                  : "text-gray-500 hover:text-white"
              }
            `}
          >
            <ThumbsUp
              size={13}
              className={tweet.isLikedByMe ? "fill-blue-400/20" : ""}
            />
            <span>{tweet.likesCount || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TweetCard;
