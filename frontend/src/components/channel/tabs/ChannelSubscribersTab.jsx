import { useState } from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { useGetSubscribers, useToggleSubscription } from "../../../hooks/useSubscription.js";
import { useCurrentUser } from "../../../hooks/useAuth.js";
import Loader from "../../common/Loader.jsx";
import { formatDate } from "../../../utils/formatDate.js";

function ChannelSubscribersTab({ userId }) {
  const { data, isLoading } = useGetSubscribers(userId);
  const currentUser = useCurrentUser();

  if (isLoading) return <Loader />;

  const subscribers = data?.subscribers ?? [];

  if (subscribers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <Users size={48} className="text-gray-700" />
        <div>
          <p className="text-white font-medium">No subscribers yet</p>
          <p className="text-gray-400 text-sm mt-1">
            When people subscribe to this channel, they will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 max-w-4xl space-y-4">
      <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
        <Users size={20} className="text-gray-400" />
        Subscribers ({data?.subscribersCount ?? 0})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {subscribers.map(({ subscriber, isSubscribedBack, subscribedAt }) => (
          <SubscriberCard
            key={subscriber._id}
            subscriber={subscriber}
            isSubscribedBack={isSubscribedBack}
            subscribedAt={subscribedAt}
            isCurrentUser={currentUser?._id === subscriber._id}
          />
        ))}
      </div>
    </div>
  );
}

function SubscriberCard({ subscriber, isSubscribedBack, subscribedAt, isCurrentUser }) {
  const { mutate: toggleSub, isPending } = useToggleSubscription(subscriber._id);
  const [localSubscribed, setLocalSubscribed] = useState(isSubscribedBack);

  const handleSubscribe = () => {
    toggleSub();
    setLocalSubscribed((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:bg-gray-900 transition">
      <div className="flex items-center gap-3">
        <Link to={`/channel/${subscriber.username}`} className="shrink-0">
          <img
            src={subscriber.avatar || "/default-avatar.png"}
            alt={subscriber.username}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-800"
          />
        </Link>
        <div className="min-w-0">
          <Link to={`/channel/${subscriber.username}`}>
            <p className="text-white text-sm font-semibold hover:text-blue-400 transition truncate">
              {subscriber.fullName}
            </p>
          </Link>
          <p className="text-gray-400 text-xs truncate">@{subscriber.username}</p>
          <p className="text-gray-600 text-2xs mt-1">
            Subscribed {formatDate(subscribedAt)}
          </p>
        </div>
      </div>

      {!isCurrentUser && (
        <button
          onClick={handleSubscribe}
          disabled={isPending}
          className={`
            px-4 py-1.5 text-xs font-semibold rounded-full transition shrink-0
            ${
              localSubscribed
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-white hover:bg-gray-100 text-black"
            }
          `}
        >
          {isPending ? "..." : localSubscribed ? "Subscribed" : "Subscribe Back"}
        </button>
      )}
    </div>
  );
}

export default ChannelSubscribersTab;
