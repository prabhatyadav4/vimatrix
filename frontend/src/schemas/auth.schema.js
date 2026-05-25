import { z } from "zod";

// ── Register Schema ───────────────────────────────────────────────────────────
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters.")
      .max(50, "Full name cannot exceed 50 characters.")
      .trim(),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(20, "Username cannot exceed 20 characters.")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores.",
      )
      .toLowerCase()
      .trim(),

    email: z
      .string()
      .email("Please enter a valid email address.")
      .toLowerCase()
      .trim(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(50, "Password cannot exceed 50 characters."),

    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  // .refine validates across multiple fields at once
  // Used here to check password === confirmPassword
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // which field shows the error
  });

// ── Login Schema ──────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address.")
    .toLowerCase()
    .trim(),

  password: z.string().min(1, "Password is required."),
});

// ── Change Password Schema ────────────────────────────────────────────────────
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(50, "New password cannot exceed 50 characters."),

    confirmNewPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });

// ── Update Account Schema ─────────────────────────────────────────────────────
export const updateAccountSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(50, "Full name cannot exceed 50 characters.")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address.")
    .toLowerCase()
    .trim(),
});

// Types (useful if you move to TypeScript later):
// export type RegisterInput       = z.infer<typeof registerSchema>
// export type LoginInput          = z.infer<typeof loginSchema>
// export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
// export type UpdateAccountInput  = z.infer<typeof updateAccountSchema>
