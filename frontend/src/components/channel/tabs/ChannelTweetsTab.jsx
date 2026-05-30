import { useGetUserTweets } from "../../../hooks/useTweets.js";
import TweetCard from "../../tweet/TweetCard.jsx";
import Loader from "../../common/Loader.jsx";
import { Bird } from "lucide-react";


function ChannelTweetsTab({ userId }) {
  const { data: tweets, isLoading } = useGetUserTweets(userId);

  if (isLoading) return <Loader />;

  if (!tweets?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Bird size={48} className="text-gray-700" />
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
