import { Eye, Users, Film, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useGetChannelStats } from "../hooks/useChannel.js";
import { useCurrentUser } from "../hooks/useAuth.js";
import { useGetSubscribers } from "../hooks/useSubscription.js";
import { formatDate } from "../utils/formatDate.js";

import StatCard from "../components/dashboard/StatCard.jsx";
import VideoManager from "../components/dashboard/VideoManager.jsx";

import Loader from "../components/common/Loader.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

function Dashboard() {
  const user = useCurrentUser();

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetChannelStats();

  // Loading state
  if (isLoading) {
    return <Loader fullScreen />;
  }

  // Error state
  if (isError) {
    return (
      <ErrorMessage
        message={error?.response?.data?.message || "Failed to load dashboard."}
        onRetry={refetch}
      />
    );
  }

  // Dashboard statistics
  const STAT_CARDS = [
    {
      icon: <Eye size={22} className="text-blue-400" />,
      label: "Total Views",
      value: stats?.totalViews ?? 0,
      color: "blue",
    },
    {
      icon: <Users size={22} className="text-purple-400" />,
      label: "Subscribers",
      value: stats?.totalSubscribers ?? 0,
      color: "purple",
      to: `/channel/${user?.username}?tab=subscribers`,
    },
    {
      icon: <Film size={22} className="text-green-400" />,
      label: "Total Videos",
      value: stats?.totalVideos ?? 0,
      color: "green",
    },
    {
      icon: <ThumbsUp size={22} className="text-red-400" />,
      label: "Total Likes",
      value: stats?.totalLikes ?? 0,
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-black p-4 md:p-6 space-y-8">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Dashboard</h1>

          <p className="text-gray-400 text-sm mt-1">
            Welcome back,{" "}
            <span className="text-white font-medium">{user?.fullName}</span> 👋
          </p>
        </div>

        {/* Upload button */}
        <a
          href="/upload"
          className="
            flex items-center gap-2
            px-4 py-2
            bg-blue-600 hover:bg-blue-700
            text-white text-sm font-medium
            rounded-xl
            transition
          "
        >
          <Film size={16} />

          <span className="hidden sm:inline">Upload Video</span>
        </a>
      </div>

      {/* ── Stats Section ───────────────────────────────── */}
      <section>
        <h2 className="text-white font-semibold mb-4">Channel Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARDS.map((card) => {
            const cardEl = <StatCard key={card.label} {...card} />;
            return card.to ? (
              <Link key={card.label} to={card.to} className="block group">
                {cardEl}
              </Link>
            ) : (
              cardEl
            );
          })}
        </div>
      </section>

      {/* ── Content Grid: Video Manager + Recent Subscribers ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-white font-semibold">Your Videos</h2>
          <VideoManager />
        </div>

        <div className="space-y-4">
          <h2 className="text-white font-semibold">Recent Subscribers</h2>
          <RecentSubscribersPanel userId={user?._id} username={user?.username} />
        </div>
      </div>
    </div>
  );
}

// ── Recent Subscribers Panel Component ────────────────────────────────────────
function RecentSubscribersPanel({ userId, username }) {
  const { data, isLoading } = useGetSubscribers(userId);

  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center text-gray-400 animate-pulse">
        Loading subscribers...
      </div>
    );
  }

  const subscribers = data?.subscribers?.slice(0, 5) ?? [];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <span className="text-gray-300 text-sm font-semibold flex items-center gap-2">
          <Users size={16} className="text-purple-400" />
          Recent Subscribers
        </span>
        {username && (
          <Link
            to={`/channel/${username}?tab=subscribers`}
            className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition"
          >
            View all
          </Link>
        )}
      </div>

      {subscribers.length === 0 ? (
        <p className="text-gray-500 text-xs text-center py-6">
          No subscribers yet.
        </p>
      ) : (
        <div className="space-y-3.5">
          {subscribers.map(({ subscriber, subscribedAt }) => (
            <div key={subscriber._id} className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <Link to={`/channel/${subscriber.username}`} className="shrink-0">
                  <img
                    src={subscriber.avatar || "/default-avatar.png"}
                    alt={subscriber.username}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-800"
                  />
                </Link>
                <div className="min-w-0">
                  <Link to={`/channel/${subscriber.username}`}>
                    <p className="text-white text-xs font-semibold hover:text-blue-400 transition truncate">
                      {subscriber.fullName}
                    </p>
                  </Link>
                  <p className="text-gray-500 text-2xs truncate">
                    @{subscriber.username}
                  </p>
                </div>
              </div>
              <span className="text-gray-600 text-3xs shrink-0 font-medium">
                {formatDate(subscribedAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
