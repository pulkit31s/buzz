import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    collegeId: z
      .string()
      .min(3, "College ID must be at least 3 characters")
      .trim(),
    email: z
      .string()
      .email("Please provide a valid college email address")
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password is too long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
      .trim(),
    year: z.string().min(1, "Academic year is required").trim(),
    branch: z.string().min(1, "Branch/Department is required").trim(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please provide a valid email address")
      .trim()
      .toLowerCase(),
    password: z.string().min(1, "Password is required"),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
