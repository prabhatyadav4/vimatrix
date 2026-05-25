import { z } from "zod";

// ── Create Tweet Schema ───────────────────────────────────────────────────────
export const tweetSchema = z.object({
  content: z
    .string()
    .min(1, "Tweet cannot be empty.")
    .max(280, "Tweet cannot exceed 280 characters.")
    .trim(),
});

// ── Update Tweet Schema ───────────────────────────────────────────────────────
export const updateTweetSchema = z.object({
  content: z
    .string()
    .min(1, "Tweet cannot be empty.")
    .max(280, "Tweet cannot exceed 280 characters.")
    .trim(),
});
