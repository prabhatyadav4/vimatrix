import { useState } from "react";
import { useGetAllVideos } from "@/hooks/useVideos";
import VideoGrid from "../components/video/VideoGrid.jsx";
import Loader from "../components/common/Loader.jsx";

function Home() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, error } = useGetAllVideos({
    page,
    limit: 12,
  });

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="p-6">
      <VideoGrid videos={data?.docs || []} />

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-800 rounded disabled:opacity-40"
        >
          Previous
        </button>
        <span className="text-gray-400 py-2">
          Page {page} of {data?.totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === data?.totalPages}
          className="px-4 py-2 bg-gray-800 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;
