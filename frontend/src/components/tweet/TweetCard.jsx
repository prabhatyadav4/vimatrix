import { ThumbsUp } from "lucide-react";
import { formatDate } from "../../utils/formatDate.js";

// Reusable standalone TweetCard Component
function TweetCard({ tweet }) {
  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 space-y-3">
      <div className="flex items-center gap-3">
        <img
          src={tweet.owner?.avatar}
          alt={tweet.owner?.username}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <p className="text-white text-sm font-medium">
            {tweet.owner?.fullName}
          </p>
          <p className="text-gray-400 text-xs">
            @{tweet.owner?.username} · {formatDate(tweet.createdAt)}
          </p>
        </div>
      </div>
      <p className="text-gray-200 text-sm leading-relaxed">{tweet.content}</p>
      <div className="flex items-center gap-1 text-gray-500 text-xs">
        <ThumbsUp size={12} />
        <span>{tweet.likesCount || 0}</span>
      </div>
    </div>
  );
}

export default TweetCard;
