import { Routes, Route } from "react-router-dom";
import { useSidebar } from "./context/SidebarContext.jsx";
import { Suspense, lazy } from "react";

// New Concept: React.lazy + Suspense (code splitting)
// Instead of importing all pages upfront (one large JS bundle),
// lazy() splits each page into its own chunk downloaded on demand.
// Users only download code for pages they actually visit.
// Suspense shows a fallback while the chunk loads.

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const VideoWatch = lazy(() => import("./pages/VideoWatch.jsx"));
const Channel = lazy(() => import("./pages/Channel.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const VideoUpload = lazy(() => import("./pages/VideoUpload.jsx"));
const Tweets = lazy(() => import("./pages/Tweets.jsx"));
const LikedVideos = lazy(() => import("./pages/LikedVideos.jsx"));
const Playlists = lazy(() => import("./pages/Playlists.jsx"));
const PlaylistDetail = lazy(() => import("./pages/PlaylistDetail.jsx"));
const Subscriptions = lazy(() => import("./pages/Subscriptions.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

import Navbar from "./components/common/Navbar.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Loader from "./components/common/Loader.jsx";

function App() {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Sidebar />

      <main
        className={`pt-16 min-h-screen transition-all duration-300 ${
          isOpen ? "lg:ml-56" : "lg:ml-16"
        }`}
      >
        {/* Suspense wraps all lazy routes — shows spinner during chunk load */}
        <Suspense fallback={<Loader fullScreen />}>
          <Routes>
            {/* ── Public ── */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/watch/:videoId" element={<VideoWatch />} />
            <Route path="/channel/:username" element={<Channel />} />
            <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/tweets" element={<Tweets />} />

            {/* ── Protected (must be logged in) ── */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<VideoUpload />} />
              <Route path="/liked-videos" element={<LikedVideos />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
            </Route>

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
