import {
  useCreateTweet,
  useGetUserTweets,
  useDeleteTweet,
} from "../hooks/useTweets.js";
import { useCurrentUser } from "../hooks/useAuth.js";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { getErrorMessage } from "../utils/errorHandler.js";
import { formatDate } from "../utils/formatDate.js";

function Tweets() {
  const user = useCurrentUser();
  const [content, setContent] = useState("");
  const { data: tweets, isLoading } = useGetUserTweets(user?._id);

  const {
    mutate: createTweet,
    isPending: isCreating,
    isError,
    error,
  } = useCreateTweet();

  const { mutate: deleteTweet } = useDeleteTweet();

  const handleSubmit = () => {
    if (!content.trim()) return;
    createTweet(content, {
      onSuccess: () => setContent(""),
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Create tweet */}
      <div className="bg-gray-900 rounded-xl p-4 space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          className="w-full bg-gray-800 text-white rounded-lg p-3 resize-none outline-none"
        />
        <div className="flex justify-between items-center">
          <span
            className={`text-sm ${280 - content.length < 0 ? "text-red-500" : "text-gray-400"}`}
          >
            {280 - content.length} characters left
          </span>
          <button
            onClick={handleSubmit}
            disabled={isCreating || !content.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-full text-sm font-medium"
          >
            {isCreating ? "Posting..." : "Tweet"}
          </button>
        </div>
        {isError && (
          <p className="text-red-500 text-sm">{getErrorMessage(error)}</p>
        )}
      </div>

      {/* Tweet list */}
      {isLoading ? (
        <p className="text-gray-400 text-center">Loading tweets...</p>
      ) : (
        <div className="space-y-4">
          {tweets?.map((tweet) => (
            <div
              key={tweet._id}
              className="bg-gray-900 rounded-xl p-4 flex justify-between"
            >
              <div>
                <p className="text-white">{tweet.content}</p>
                <p className="text-gray-500 text-xs mt-2">
                  {formatDate(tweet.createdAt)}
                </p>
              </div>
              {tweet.owner._id === user?._id && (
                <button
                  onClick={() => deleteTweet(tweet._id)}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tweets;
