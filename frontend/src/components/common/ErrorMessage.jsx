// src/components/common/ErrorMessage.jsx
import { AlertCircle, RefreshCw } from "lucide-react";

function ErrorMessage({ message = "Something went wrong.", onRetry = null }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <AlertCircle size={48} className="text-red-500" />
      <p className="text-gray-400 max-w-xs">{message}</p>
      {/* Only show retry button if a retry function was passed */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
