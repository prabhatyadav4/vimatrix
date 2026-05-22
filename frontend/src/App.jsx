// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useSidebar } from "./context/SidebarContext.jsx";

import Navbar from "./components/common/Navbar.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

// Pages (create empty ones for now)
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VideoWatch from "./pages/VideoWatch.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tweets from "./pages/Tweets.jsx";
import LikedVideos from "./pages/LikedVideos.jsx";
import NotFound from "./pages/NotFound.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import VideoUpload from "./pages/VideoUpload.jsx";

function App() {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Fixed navbar — always on top */}
      <Navbar />

      {/* Fixed sidebar — always on left */}
      <Sidebar />

      {/* Main content — shifts right when sidebar is open */}
      <main
        className={`
          pt-16 min-h-screen transition-all duration-300
          ${isOpen ? "lg:ml-56" : "lg:ml-16"}
        `}
        // pt-16 = clears the 64px navbar
        // lg:ml-56 or lg:ml-16 = shifts content right equal to sidebar width
        // transition = smooth animation when sidebar toggles
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/watch/:videoId" element={<VideoWatch />} />
          <Route path="/tweets" element={<Tweets />} />
          <Route path="/search" element={<SearchResults />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/liked-videos" element={<LikedVideos />} />
            <Route path="/upload" element={<VideoUpload />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
