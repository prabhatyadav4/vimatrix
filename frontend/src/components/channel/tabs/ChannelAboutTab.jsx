import { Calendar, Users, Eye } from "lucide-react";
import { formatViews } from "../../../utils/formatViews.js";

function ChannelAboutTab({ channel }) {
  // Format ISO date to readable string
  const joinedDate = channel?.createdAt
    ? new Date(channel.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const stats = [
    {
      icon: <Eye size={18} className="text-gray-400" />,
      label: "Total views",
      value: formatViews(channel?.totalViews ?? 0),
    },
    {
      icon: <Users size={18} className="text-gray-400" />,
      label: "Subscribers",
      value: formatViews(channel?.subscribersCount ?? 0),
    },
    {
      icon: <Calendar size={18} className="text-gray-400" />,
      label: "Joined",
      value: joinedDate,
    },
  ];

  return (
    <div className="px-4 md:px-6 py-6 max-w-2xl space-y-8">
      {/* Description */}
      {channel?.description && (
        <div className="space-y-2">
          <h3 className="text-white font-semibold">Description</h3>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
            {channel.description}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold">Channel stats</h3>
        <div className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              {stat.icon}
              <span className="text-gray-400 text-sm w-28">{stat.label}</span>
              <span className="text-white text-sm font-medium">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChannelAboutTab;
