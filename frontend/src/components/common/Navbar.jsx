import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Menu,
  Upload,
  Bell,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext.jsx";
import { useCurrentUser } from "../../hooks/useAuth.js";
import { useLogout } from "../../hooks/useAuth.js";

function Navbar() {
  const { toggle } = useSidebar();
  const user = useCurrentUser();
  const navigate = useNavigate();

  // ── Search state ────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();

  // Sync search box with URL query param
  // Clear when navigating away from /search
  useEffect(() => {
    const q = searchParams.get("query");
    setSearchQuery(q || "");
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
  };

  // ── Avatar dropdown state ───────────────────────────────────────────────────
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // ref to detect clicks outside

  // Close dropdown when user clicks anywhere outside it
  // New Concept: useRef for DOM access + event listeners
  useEffect(() => {
    const handleClickOutside = (e) => {
      // dropdownRef.current is the actual DOM node
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup: remove listener when Navbar unmounts
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Logout ──────────────────────────────────────────────────────────────────
  const { mutate: logout } = useLogout();

  return (
    // fixed     → sticks to top of viewport (doesn't scroll)
    // z-50      → sits above sidebar and content
    // h-16      → 64px height — must match pt-16 on main content
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 z-50">
      {/* ── Left: Hamburger + Logo ────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Hamburger button toggles sidebar */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">VT</span>
          </div>
          <span className="text-white font-bold text-lg hidden sm:block">
            VideoTube
          </span>
        </Link>
      </div>

      {/* ── Center: Search bar ────────────────────────────────────────────── */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-2 flex-1 max-w-xl mx-4"
      >
        <div className="flex flex-1 items-center bg-gray-800 rounded-full px-4 py-2 border border-gray-700 focus-within:border-blue-500 transition">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
          />
        </div>
        <button
          type="submit"
          className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white border border-gray-700 transition"
        >
          <Search size={18} />
        </button>
      </form>

      {/* ── Right: Actions + Avatar ───────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        {user ? (
          <>
            {/* Upload button */}
            <button
              onClick={() => navigate("/upload")}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-full border border-gray-700 transition"
            >
              <Upload size={16} />
              <span>Upload</span>
            </button>

            {/* Avatar + dropdown */}
            {/* New Concept: ref on a div to track clicks outside it */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center"
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.username}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-700 hover:ring-blue-500 transition"
                />
              </button>

              {/* Dropdown menu — only renders when dropdownOpen is true */}
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl py-1 z-50">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-white font-medium text-sm truncate">
                      {user.fullName}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      @{user.username}
                    </p>
                  </div>

                  {/* Menu items */}
                  <DropdownItem
                    icon={<User size={16} />}
                    label="Your Channel"
                    to={`/channel/${user.username}`}
                    onClick={() => setDropdownOpen(false)}
                  />
                  <DropdownItem
                    icon={<LayoutDashboard size={16} />}
                    label="Dashboard"
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                  />

                  <div className="border-t border-gray-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-800 transition"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Not logged in */
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm text-white border border-gray-700 rounded-full hover:bg-gray-800 transition"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-full transition"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

// Small helper component — avoids repeating Link+icon+label three times
// New Concept: small presentational sub-components defined in same file
function DropdownItem({ icon, label, to, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </Link>
  );
}

export default Navbar;
