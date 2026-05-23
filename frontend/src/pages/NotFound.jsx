import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center gap-6">
      {/* Big 404 */}
      <div className="relative">
        <p className="text-[10rem] font-black text-gray-800 leading-none select-none">
          404
        </p>
        <p className="absolute inset-0 flex items-center justify-center text-[10rem] font-black text-transparent bg-clip-text bg-linear-to-b from-gray-600 to-transparent leading-none select-none">
          404
        </p>
      </div>

      <div className="space-y-2">
        <h1 className="text-white font-bold text-2xl">Page not found</h1>
        <p className="text-gray-400 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-xl border border-gray-700 transition"
        >
          <ArrowLeft size={16} />
          Go back
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-xl transition"
        >
          <Home size={16} />
          Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
