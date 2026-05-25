import { z } from "zod";

// ── File size and type constants ──────────────────────────────────────────────
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB in bytes
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime", // .mov files
];

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// ── Upload Video Schema ───────────────────────────────────────────────────────
export const uploadVideoSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title cannot exceed 100 characters.")
    .trim(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters.")
    .trim(),

  // FileList is what <input type="file"> returns
  // We validate the first file inside it
  videoFile: z
    .any()
    .refine((fileList) => fileList?.length > 0, "Video file is required.")
    .refine(
      (fileList) => fileList?.[0]?.size <= MAX_VIDEO_SIZE,
      "Video file must be smaller than 100MB.",
    )
    .refine(
      (fileList) => ACCEPTED_VIDEO_TYPES.includes(fileList?.[0]?.type),
      "Only MP4, WebM, OGG and MOV video formats are supported.",
    ),

  thumbnail: z
    .any()
    .refine((fileList) => fileList?.length > 0, "Thumbnail image is required.")
    .refine(
      (fileList) => fileList?.[0]?.size <= MAX_THUMBNAIL_SIZE,
      "Thumbnail must be smaller than 5MB.",
    )
    .refine(
      (fileList) => ACCEPTED_IMAGE_TYPES.includes(fileList?.[0]?.type),
      "Only JPG, PNG and WebP image formats are supported.",
    ),
});

// ── Update Video Schema ───────────────────────────────────────────────────────
// For updating, all fields are optional
// But at least one must be provided (checked in controller)
export const updateVideoSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title cannot exceed 100 characters.")
    .trim()
    .optional(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters.")
    .trim()
    .optional(),

  // Thumbnail is optional on update
  thumbnail: z
    .any()
    .refine(
      (fileList) =>
        !fileList ||
        fileList.length === 0 ||
        fileList[0].size <= MAX_THUMBNAIL_SIZE,
      "Thumbnail must be smaller than 5MB.",
    )
    .refine(
      (fileList) =>
        !fileList ||
        fileList.length === 0 ||
        ACCEPTED_IMAGE_TYPES.includes(fileList[0].type),
      "Only JPG, PNG and WebP image formats are supported.",
    )
    .optional(),
});

// ── Playlist Schema (bonus — used in Playlists page) ─────────────────────────
export const createPlaylistSchema = z.object({
  name: z
    .string()
    .min(1, "Playlist name is required.")
    .max(100, "Playlist name cannot exceed 100 characters.")
    .trim(),

  description: z
    .string()
    .min(1, "Description is required.")
    .max(500, "Description cannot exceed 500 characters.")
    .trim(),
});

export const updatePlaylistSchema = z.object({
  name: z
    .string()
    .min(1, "Playlist name is required.")
    .max(100, "Playlist name cannot exceed 100 characters.")
    .trim()
    .optional(),

  description: z
    .string()
    .min(1, "Description is required.")
    .max(500, "Description cannot exceed 500 characters.")
    .trim()
    .optional(),
});
