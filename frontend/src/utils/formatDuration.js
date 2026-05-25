// Converts seconds (number) into a video duration string
// Examples:
//   3661   →  "1:01:01"   (1 hour, 1 min, 1 sec)
//   125    →  "2:05"      (2 min, 5 sec)
//   45     →  "0:45"      (45 sec)
//   0      →  "0:00"
//
// Cloudinary returns duration in seconds as a float
// e.g. 125.34 → we floor it to 125 before converting

export const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return "";

  // Floor to remove decimal part (125.34 → 125)
  const totalSeconds = Math.floor(seconds);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  // Pad seconds with leading zero always (5 → "05")
  const paddedSecs = String(secs).padStart(2, "0");

  if (hours > 0) {
    // Pad minutes with leading zero only when hours exist (5 → "05")
    const paddedMins = String(minutes).padStart(2, "0");
    return `${hours}:${paddedMins}:${paddedSecs}`;
  }

  // No hours — minutes don't need padding
  return `${minutes}:${paddedSecs}`;
};

// Examples to verify:
// formatDuration(0)      → "0:00"
// formatDuration(45)     → "0:45"
// formatDuration(60)     → "1:00"
// formatDuration(125)    → "2:05"
// formatDuration(3600)   → "1:00:00"
// formatDuration(3661)   → "1:01:01"
// formatDuration(7322)   → "2:02:02"
