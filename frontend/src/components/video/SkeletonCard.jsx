// New Concept: the "pulse" animation
// Tailwind's animate-pulse fades opacity 100% → 50% → 100% repeatedly
// Applied to grey blocks → looks like content is loading

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {/* Thumbnail placeholder */}
      {/* aspect-video = 16:9 ratio — matches real thumbnail */}
      <div className="w-full aspect-video bg-gray-800 rounded-xl" />

      {/* Info row */}
      <div className="flex gap-3 px-1">
        {/* Avatar circle placeholder */}
        <div className="w-9 h-9 rounded-full bg-gray-800 shrink-0 mt-0.5" />

        {/* Text lines */}
        <div className="flex-1 space-y-2">
          {/* Title — two lines */}
          <div className="h-4 bg-gray-800 rounded-md w-full" />
          <div className="h-4 bg-gray-800 rounded-md w-3/4" />
          {/* Channel name */}
          <div className="h-3 bg-gray-800 rounded-md w-1/2" />
          {/* Views + date */}
          <div className="h-3 bg-gray-800 rounded-md w-2/5" />
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
