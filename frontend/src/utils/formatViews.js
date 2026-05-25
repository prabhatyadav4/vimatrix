// Converts a large number into a short readable string
// Examples:
//   1500000  →  "1.5M"
//   1300000  →  "1.3M"
//   45000    →  "45K"
//   4500     →  "4.5K"
//   999      →  "999"
//   0        →  "0"

export const formatViews = (count) => {
  if (count === null || count === undefined) return "0";
  if (count === 0) return "0";

  if (count >= 1_000_000_000) {
    // Billions: 1200000000 → "1.2B"
    return `${(count / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  }

  if (count >= 1_000_000) {
    // Millions: 1500000 → "1.5M"
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (count >= 1_000) {
    // Thousands: 4500 → "4.5K" | 45000 → "45K"
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  // Less than 1000 — show as is
  return String(count);
};

// .replace(/\.0$/, "") removes unnecessary decimal
// Without it:  1000000 → "1.0M"   (ugly)
// With it:     1000000 → "1M"     (clean)
// But keeps:   1500000 → "1.5M"   (useful decimal stays)

// formatSubscribers — same logic but used for subscriber counts
// Shows "subscribers" label too
// Example: 1500 → "1.5K subscribers"
export const formatSubscribers = (count) => {
  if (!count && count !== 0) return "0 subscribers";
  return `${formatViews(count)} subscriber${count !== 1 ? "s" : ""}`;
};

// Examples to verify:
// formatViews(0)          → "0"
// formatViews(999)        → "999"
// formatViews(1000)       → "1K"
// formatViews(1500)       → "1.5K"
// formatViews(45000)      → "45K"
// formatViews(1000000)    → "1M"
// formatViews(1500000)    → "1.5M"
// formatViews(1000000000) → "1B"
