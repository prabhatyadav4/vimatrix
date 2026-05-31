// New Concept: Two-phase upload progress
// Phase 1: Browser → Node.js server (trackable via onUploadProgress)
// Phase 2: Node.js → Cloudinary (not trackable, show indeterminate)
//
// We scale phase 1 from 0-80%, then show a pulsing "Processing..." state
// once the browser upload completes (progress === 100 from Axios).

function UploadProgressBar({ progress }) {
  if (progress === 0) return null;

  // Phase 1: browser → server (maps 0-100% to 0-80%)
  // Phase 2: server → Cloudinary (indeterminate at 80%+)
  const isBrowserUploadDone = progress === 100;
  const displayProgress = isBrowserUploadDone ? 80 : Math.round(progress * 0.8);

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>
          {isBrowserUploadDone ? "Processing on server..." : "Uploading..."}
        </span>
        <span>
          {isBrowserUploadDone ? "Almost there" : `${displayProgress}%`}
        </span>
      </div>

      {/* Track */}
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        {isBrowserUploadDone ? (
          /* Indeterminate shimmer animation for server processing */
          <div className="h-full w-full rounded-full bg-linear-to-r from-blue-500 via-purple-500 to-blue-500 animate-pulse" />
        ) : (
          /* Determinate bar for browser upload */
          <div
            style={{ width: `${displayProgress}%` }}
            className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-out"
          />
        )}
      </div>

      {isBrowserUploadDone && (
        <p className="text-blue-400 text-xs text-center animate-pulse">
          Your video is being processed on the server. This may take a minute...
        </p>
      )}
    </div>
  );
}

export default UploadProgressBar;
