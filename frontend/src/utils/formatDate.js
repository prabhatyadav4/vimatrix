// Converts an ISO date string into a human-readable relative time
// Examples:
//   "2024-01-15T10:30:00Z"  →  "3 days ago"
//   "2024-01-15T10:29:00Z"  →  "1 minute ago"
//   "2023-06-01T00:00:00Z"  →  "7 months ago"

export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date; // difference in milliseconds

  // Convert to different units
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Return the most appropriate unit
  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours}   hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days}    day${days > 1 ? "s" : ""} ago`;
  if (weeks < 4) return `${weeks}   week${weeks > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months}  month${months > 1 ? "s" : ""} ago`;
  return `${years}   year${years > 1 ? "s" : ""} ago`;
};

// Converts ISO date to a readable full date string
// Example: "2024-01-15T10:30:00Z"  →  "15 January 2024"
export const formatFullDate = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Converts ISO date to short format
// Example: "2024-01-15T10:30:00Z"  →  "Jan 15, 2024"
export const formatShortDate = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
