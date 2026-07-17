import { z } from "zod";
import { ANONYMOUS_NAMES } from "./user.model";

/**
 * Zod schema for updating a user profile (`PATCH /api/v1/users/me`).
 * Only allows safe, non-sensitive profile fields to be updated.
 */
export const updateProfileSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
      .trim()
      .optional(),
    year: z.string().min(1, "Academic year cannot be empty").trim().optional(),
    branch: z.string().min(1, "Branch/Department cannot be empty").trim().optional(),
    anonymousName: z
      .enum(ANONYMOUS_NAMES, {
        message: `Anonymous identity must be one of: ${ANONYMOUS_NAMES.join(", ")}`,
      })
      .optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update (username, year, branch, or anonymousName)",
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
