import { useParams, useSearchParams } from "react-router-dom";
import { useGetChannelProfile } from "../hooks/useChannel.js";
import ChannelHeader from "../components/channel/ChannelHeader.jsx";
import ChannelTabs from "../components/channel/ChannelTabs.jsx";
import ChannelVideosTab from "../components/channel/tabs/ChannelVideosTab.jsx";
import ChannelPlaylistsTab from "../components/channel/tabs/ChannelPlaylistsTab.jsx";
import ChannelTweetsTab from "../components/channel/tabs/ChannelTweetsTab.jsx";
import ChannelSubscribersTab from "../components/channel/tabs/ChannelSubscribersTab.jsx";
import ChannelSubscriptionsTab from "../components/channel/tabs/ChannelSubscriptionsTab.jsx";
import ChannelAboutTab from "../components/channel/tabs/ChannelAboutTab.jsx";
import Loader from "../components/common/Loader.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";

function Channel() {
  // Read :username from URL → /channel/rahul_dev
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "videos";

  const {
    data: channel,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetChannelProfile(username);

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <ErrorMessage
        message={error?.response?.data?.message || "Channel not found."}
        onRetry={refetch}
      />
    );
  }

  if (!channel) return null;

  // New Concept: component lookup object
  // Instead of a long if/else or switch, map tab names to components.
  // Clean, easy to extend — add a new tab by adding one line here.
  const TAB_COMPONENTS = {
    videos: <ChannelVideosTab userId={channel._id} />,
    playlists: <ChannelPlaylistsTab userId={channel._id} />,
    tweets: <ChannelTweetsTab userId={channel._id} />,
    subscribers: <ChannelSubscribersTab userId={channel._id} />,
    subscriptions: <ChannelSubscriptionsTab userId={channel._id} />,
    about: <ChannelAboutTab channel={channel} />,
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Banner + avatar + stats + subscribe */}
      <ChannelHeader channel={channel} />

      {/* Sticky tab bar */}
      <ChannelTabs />

      {/* Tab content — renders the matching component */}
      <div>
        {TAB_COMPONENTS[activeTab] ?? <ChannelVideosTab userId={channel._id} />}
      </div>
    </div>
  );
}

export default Channel;
