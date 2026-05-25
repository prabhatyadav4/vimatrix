import { z } from "zod";

// ── Add Comment Schema ────────────────────────────────────────────────────────
export const addCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty.")
    .max(1000, "Comment cannot exceed 1000 characters.")
    .trim(),
});

// ── Update Comment Schema ─────────────────────────────────────────────────────
// Same rules as adding — just a separate schema for clarity
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty.")
    .max(1000, "Comment cannot exceed 1000 characters.")
    .trim(),
});
