import { useGetUserTweets } from "../../../hooks/useTweets.js";
import TweetCard from "../../tweet/TweetCard.jsx";
import Loader from "../../common/Loader.jsx";
import { Twitter } from "lucide-react";

// Reusable standalone TweetCard
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
        <span>{tweet.likesCount}</span>
      </div>
    </div>
  );
}

function ChannelTweetsTab({ userId }) {
  const { data: tweets, isLoading } = useGetUserTweets(userId);

  if (isLoading) return <Loader />;

  if (!tweets?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Twitter size={48} className="text-gray-700" />
        <p className="text-gray-400">No tweets yet.</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 max-w-2xl space-y-4">
      {tweets.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}
    </div>
  );
}

export default ChannelTweetsTab;
