import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { useGetSubscribedChannels } from "../hooks/useSubscription.js";
import { useCurrentUser } from "../hooks/useAuth.js";
import Loader from "../components/common/Loader.jsx";
import { formatViews } from "../utils/formatViews.js";
import { formatDate } from "../utils/formatDate.js";

function Subscriptions() {
  const user = useCurrentUser();
  const { data, isLoading } = useGetSubscribedChannels(user?._id);
  const channels = data?.subscribedChannels ?? [];

  if (isLoading) return <Loader />;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <Users size={20} className="text-green-400" />
        </div>
        <div>
          <h1 className="text-white font-bold text-xl">Subscriptions</h1>
          <p className="text-gray-400 text-sm">
            {channels.length} channel{channels.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {channels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <Users size={56} className="text-gray-700" />
          <div>
            <p className="text-white font-medium">No subscriptions yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Subscribe to channels to see them here.
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition"
          >
            Explore videos
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {channels.map(({ channel, latestVideo, subscribedAt }) => (
            <ChannelRow
              key={channel._id}
              channel={channel}
              latestVideo={latestVideo}
              subscribedAt={subscribedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChannelRow({ channel, latestVideo, subscribedAt }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-900 transition group">
      {/* Avatar */}
      <Link to={`/channel/${channel.username}`} className="shrink-0">
        <img
          src={channel.avatar}
          alt={channel.username}
          className="w-12 h-12 rounded-full object-cover group-hover:opacity-90 transition ring-2 ring-transparent group-hover:ring-blue-500"
        />
      </Link>

      {/* Channel info */}
      <div className="flex-1 min-w-0">
        <Link to={`/channel/${channel.username}`}>
          <p className="text-white text-sm font-medium hover:text-blue-400 transition">
            {channel.fullName}
          </p>
        </Link>
        <p className="text-gray-500 text-xs">
          @{channel.username} · Subscribed {formatDate(subscribedAt)}
        </p>
      </div>

      {/* Latest video preview */}
      {latestVideo && (
        <Link
          to={`/watch/${latestVideo._id}`}
          className="hidden sm:flex items-center gap-2 shrink-0 group/vid"
        >
          <img
            src={latestVideo.thumbnail}
            alt={latestVideo.title}
            className="w-24 aspect-video object-cover rounded-lg group-hover/vid:opacity-80 transition"
          />
          <div className="hidden md:block max-w-40">
            <p className="text-gray-300 text-xs line-clamp-2 group-hover/vid:text-white transition">
              {latestVideo.title}
            </p>
            <p className="text-gray-600 text-xs mt-0.5">
              {formatDate(latestVideo.createdAt)}
            </p>
          </div>
        </Link>
      )}
    </div>
  );
}

export default Subscriptions;
