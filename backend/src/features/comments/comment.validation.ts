import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, "Comment content cannot be empty")
      .max(1000, "Comment cannot exceed 1000 characters")
      .trim(),
    parentComment: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Parent Comment ID")
      .optional()
      .nullable(),
  }),
});

export const updateCommentSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, "Comment content cannot be empty")
      .max(1000, "Comment cannot exceed 1000 characters")
      .trim(),
  }),
});

export const commentIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Comment ID"),
  }),
});

export const postCommentParamSchema = z.object({
  params: z.object({
    postId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Post ID"),
  }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>["body"];
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>["body"];
