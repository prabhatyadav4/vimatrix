import { useState, useMemo } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { useGetChannelVideos } from "../../hooks/useChannel.js";
import { useDeleteVideo } from "../../hooks/useDashboard.js";
import useDebounce from "../../hooks/useDebounce.js";
import VideoRow from "./VideoRow.jsx";
import DeleteConfirmModal from "./DeleteConfirmModal.jsx";
import Loader from "../common/Loader.jsx";

function VideoManager() {
  const { data, isLoading } = useGetChannelVideos();
  const videos = data?.docs ?? [];

  // ── Toolbar state ──────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all"); // "all"|"published"|"draft"

  // Debounce search — wait 400ms after user stops typing
  const searchQuery = useDebounce(searchInput, 400);

  // Delete modal state
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { mutate: deleteVideo, isPending: isDeleting } = useDeleteVideo();

  // ── Open delete modal ──────────────────────────────────────────────────────
  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!videoToDelete) return;
    deleteVideo(videoToDelete._id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setVideoToDelete(null);
      },
    });
  };

  // ── Sort toggle helper ─────────────────────────────────────────────────────
  const handleSort = (field) => {
    if (sortField === field) {
      // Same field → flip direction
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      // New field → default to desc
      setSortField(field);
      setSortDir("desc");
    }
  };

  // ── Filter + sort + search on CLIENT side ─────────────────────────────────
  // New Concept: useMemo
  // This computation runs only when its dependencies change.
  // Without useMemo, it runs on EVERY render — wasteful for large lists.
  // With useMemo, it's cached and recomputed only when
  // videos/searchQuery/sortField/sortDir/filterStatus actually change.
  const processedVideos = useMemo(() => {
    let result = [...videos];

    // 1. Filter by publish status
    if (filterStatus === "published") {
      result = result.filter((v) => v.isPublished);
    } else if (filterStatus === "draft") {
      result = result.filter((v) => !v.isPublished);
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((v) => v.title.toLowerCase().includes(q));
    }

    // 3. Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle date strings
      if (sortField === "createdAt") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [videos, searchQuery, sortField, sortDir, filterStatus]);

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-4">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search videos..."
            className="w-full pl-9 pr-4 py-2 bg-gray-800 text-white text-sm rounded-xl border border-gray-700 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2">
          {["all", "published", "draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
                px-3 py-2 text-xs font-medium rounded-xl transition capitalize
                ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-sm self-center ml-auto">
          {processedVideos.length} video
          {processedVideos.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full">
          {/* Sticky header */}
          <thead className="bg-gray-900 border-b border-gray-800">
            <tr>
              <th className="py-3 pl-4 pr-3 text-left">
                <SortButton
                  label="Video"
                  field="title"
                  current={sortField}
                  direction={sortDir}
                  onSort={handleSort}
                />
              </th>
              <th className="py-3 px-3 text-left text-xs text-gray-400 font-medium">
                Status
              </th>
              <th className="py-3 px-3 text-left">
                <SortButton
                  label="Views"
                  field="views"
                  current={sortField}
                  direction={sortDir}
                  onSort={handleSort}
                />
              </th>
              <th className="py-3 px-3 text-left">
                <SortButton
                  label="Likes"
                  field="likesCount"
                  current={sortField}
                  direction={sortDir}
                  onSort={handleSort}
                />
              </th>
              <th className="py-3 pl-3 pr-4 text-left text-xs text-gray-400 font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800/50">
            {processedVideos.length > 0 ? (
              processedVideos.map((video) => (
                <VideoRow
                  key={video._id}
                  video={video}
                  onDeleteClick={handleDeleteClick}
                />
              ))
            ) : (
              // Empty state inside table
              <tr>
                <td colSpan={5} className="py-16 text-center text-gray-500">
                  {searchQuery
                    ? `No videos matching "${searchQuery}"`
                    : "No videos yet. Upload your first video!"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        video={videoToDelete}
        isPending={isDeleting}
      />
    </div>
  );
}

// ── Sort button with direction indicator ──────────────────────────────────────
// New Concept: presentational helper with visual state
function SortButton({ label, field, current, direction, onSort }) {
  const isActive = current === field;

  return (
    <button
      onClick={() => onSort(field)}
      className={`
        flex items-center gap-1.5 text-xs font-medium transition
        ${isActive ? "text-white" : "text-gray-400 hover:text-white"}
      `}
    >
      {label}
      <ArrowUpDown
        size={12}
        className={isActive ? "text-blue-400" : "text-gray-600"}
      />
    </button>
  );
}

export default VideoManager;
