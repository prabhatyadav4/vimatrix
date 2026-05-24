// New Concept: CSS transitions on width
// We animate the bar by transitioning the `width` style property.
// The browser smoothly interpolates between 0% and 100%.

function UploadProgressBar({ progress }) {
  if (progress === 0) return null;

  const isComplete = progress === 100;

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>{isComplete ? "Processing..." : "Uploading..."}</span>
        <span>{progress}%</span>
      </div>

      {/* Track */}
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        {/* Bar — width transitions smoothly */}
        <div
          style={{ width: `${progress}%` }}
          className={`
            h-full rounded-full transition-all duration-300 ease-out
            ${
              isComplete
                ? "bg-green-500" // green when fully uploaded
                : "bg-blue-500" // blue while uploading
            }
          `}
        />
      </div>

      {isComplete && (
        <p className="text-green-400 text-xs text-center">
          Upload complete! Finalising video...
        </p>
      )}
    </div>
  );
}

export default UploadProgressBar;
