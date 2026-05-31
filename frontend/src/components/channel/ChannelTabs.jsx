// New Concept: Tab state in URL search params
// Instead of useState for active tab, we use the URL:
//   /channel/rahul          → defaults to "videos"
//   /channel/rahul?tab=playlists → playlists tab
//
// Benefits:
// - Shareable URLs ("send me your playlists tab")
// - Works with browser back/forward
// - Tab persists on page refresh

import { useSearchParams } from "react-router-dom";

const TABS = ["Videos", "Playlists", "Tweets", "Subscribers", "Subscriptions", "About"];

function ChannelTabs() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read tab from URL, default to "videos"
  const activeTab = searchParams.get("tab") || "videos";

  const handleTabChange = (tab) => {
    setSearchParams({ tab: tab.toLowerCase() });
    // This updates the URL to ?tab=playlists without a page reload
  };

  return (
    // Sticky tabs — stays at top while scrolling through content
    <div className="sticky top-16 z-30 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="px-4 md:px-6 flex gap-1 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.toLowerCase();
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`
                shrink-0 px-4 py-4 text-sm font-medium border-b-2
                transition-colors duration-200
                ${
                  isActive
                    ? "text-white border-white"
                    : "text-gray-400 border-transparent hover:text-gray-200"
                }
              `}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ChannelTabs;
