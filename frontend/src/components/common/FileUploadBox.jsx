import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Film } from "lucide-react";

// New Concept: URL.createObjectURL
// When a user selects a file, the file exists only in RAM — it has no URL yet.
// URL.createObjectURL(file) creates a TEMPORARY local URL like:
//   blob:http://localhost:5173/550e8400-e29b-41d4-a716-446655440000
// This lets you display the file in an <img> or <video> tag INSTANTLY
// without uploading it to a server first.
// Always call URL.revokeObjectURL() when done to free memory.

function FileUploadBox({
  label,
  accept, // e.g. "image/*" or "video/*"
  type = "image", // "image" | "video" — controls preview rendering
  value, // File object from parent
  onChange, // (file) => void
  error,
  aspectRatio = "aspect-video", // Tailwind class for preview box ratio
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Process a File object — create preview URL + call parent onChange
  const processFile = (file) => {
    if (!file) return;

    // Revoke previous blob URL to free memory
    if (preview) URL.revokeObjectURL(preview);

    // Create a new temporary URL for the selected file
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onChange(file);
  };

  // Handle normal file input change
  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // ── Drag and Drop handlers ─────────────────────────────────────────────────
  // New Concept: HTML Drag and Drop API
  // onDragOver  → fires continuously while dragging over the element
  // onDragLeave → fires when drag leaves the element
  // onDrop      → fires when user releases the drag
  // e.preventDefault() on dragOver is REQUIRED — without it, onDrop won't fire

  const handleDragOver = (e) => {
    e.preventDefault(); // allow drop
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // Clear selection
  const handleRemove = (e) => {
    e.stopPropagation(); // prevent triggering file input click
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange(null);
    // Reset input so same file can be selected again
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm text-gray-300 font-medium">{label}</label>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative ${aspectRatio} rounded-xl border-2 border-dashed
          cursor-pointer transition-all duration-200 overflow-hidden
          ${
            isDragging
              ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
              : preview
                ? "border-gray-700 bg-gray-900"
                : "border-gray-700 bg-gray-900 hover:border-gray-500 hover:bg-gray-800"
          }
        `}
      >
        {preview ? (
          // ── Preview ──────────────────────────────────────────────────────
          <>
            {type === "image" ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={preview}
                className="w-full h-full object-cover"
                muted
              />
            )}

            {/* Remove button — top right corner of preview */}
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded-full text-white transition"
            >
              <X size={14} />
            </button>

            {/* Filename overlay at bottom */}
            {value?.name && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-1.5">
                <p className="text-white text-xs truncate">{value.name}</p>
              </div>
            )}
          </>
        ) : (
          // ── Upload prompt ────────────────────────────────────────────────
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
              {type === "image" ? (
                <ImageIcon size={22} className="text-gray-400" />
              ) : (
                <Film size={22} className="text-gray-400" />
              )}
            </div>
            <div className="text-center">
              <p className="text-white text-sm font-medium">
                {isDragging ? "Drop it here!" : "Click or drag to upload"}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {type === "image"
                  ? "JPG, PNG, WebP — max 5MB"
                  : "MP4, WebM — max 100MB"}
              </p>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Upload size={14} />
              <span className="text-xs font-medium">Browse files</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input — triggered by clicking the drop zone */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Validation error */}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export default FileUploadBox;
