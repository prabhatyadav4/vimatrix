import { Eye, Users, Film, ThumbsUp } from "lucide-react";
import { useGetChannelStats } from "../hooks/useChannel.js";
import { useCurrentUser } from "../hooks/useAuth.js";

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
          {STAT_CARDS.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      {/* ── Video Manager ───────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Your Videos</h2>
        </div>

        <VideoManager />
      </section>
    </div>
  );
}

export default Dashboard;
