// src/components/common/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  ThumbsUp,
  ListVideo,
  History,
  Users,
  Tv,
  Twitter,
  LayoutDashboard,
  LogIn,
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext.jsx";
import { useCurrentUser } from "../../hooks/useAuth.js";

// NavLink vs Link:
// Link          → always same style
// NavLink       → adds "active" class/style automatically when route matches
// We use this to highlight the current page in the sidebar

const NAV_ITEMS = [
  { icon: <Home size={20} />, label: "Home", to: "/", public: true },
  {
    icon: <Tv size={20} />,
    label: "Subscriptions",
    to: "/subscriptions",
    public: false,
  },
  {
    icon: <ThumbsUp size={20} />,
    label: "Liked Videos",
    to: "/liked-videos",
    public: false,
  },
  {
    icon: <ListVideo size={20} />,
    label: "Playlists",
    to: "/playlists",
    public: false,
  },
  {
    icon: <History size={20} />,
    label: "Watch History",
    to: "/history",
    public: false,
  },
  { icon: <Twitter size={20} />, label: "Tweets", to: "/tweets", public: true },
  {
    icon: <LayoutDashboard size={20} />,
    label: "Dashboard",
    to: "/dashboard",
    public: false,
  },
];

function Sidebar() {
  const { isOpen } = useSidebar();
  const user = useCurrentUser();
  const navigate = useNavigate();

  return (
    <>
      {/* ── Mobile Overlay ─────────────────────────────────────────────────
          On small screens, when sidebar opens, darken the background.
          Clicking it closes the sidebar.
      ────────────────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => useSidebar().close()}
        />
      )}

      {/* ── Sidebar Panel ──────────────────────────────────────────────────
          On desktop (lg+): always visible, pushes content right
          On mobile:        slides in from left over the content
      ────────────────────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)]
          bg-gray-950 border-r border-gray-800
          flex flex-col
          transition-all duration-300 ease-in-out
          z-40
          ${isOpen ? "w-56" : "w-0 lg:w-16"}
          overflow-hidden
        `}
        // h-[calc(100vh-4rem)] = full height minus the 64px navbar
      >
        {/* ── Nav Items ──────────────────────────────────────────────────── */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            // Hide auth-required items if not logged in
            if (!item.public && !user) return null;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"} // "end" prevents "/" matching all routes
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-2.5 mx-2 rounded-lg
                  text-sm font-medium transition whitespace-nowrap
                  ${
                    isActive
                      ? "bg-gray-800 text-white" // active = highlighted
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                  }
                `}
                // NavLink's className prop can accept a function
                // that receives { isActive } — use this to style active state
              >
                <span className="shrink-0">{item.icon}</span>

                {/* Label only shows when sidebar is fully open */}
                <span
                  className={`transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* ── Bottom: Sign in prompt if not logged in ─────────────────── */}
        {!user && isOpen && (
          <div className="p-4 border-t border-gray-800">
            <p className="text-gray-400 text-xs mb-3">
              Sign in to like videos, comment, and subscribe.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 w-full px-3 py-2 border border-gray-700 rounded-lg text-sm text-white hover:bg-gray-800 transition"
            >
              <LogIn size={16} />
              Sign in
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
