import { z } from "zod";

/**
 * Helper to preprocess JSON strings sent inside multipart/form-data requests.
 */
const parseIfString = (val: unknown) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
};

export const createPostSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, "Post content cannot be empty")
      .max(2000, "Post content cannot exceed 2000 characters")
      .trim(),
    tags: z.preprocess(
      parseIfString,
      z
        .array(z.string().trim().toLowerCase())
        .max(10, "Maximum 10 tags allowed")
        .optional()
        .default([])
    ),
    poll: z.preprocess(
      parseIfString,
      z
        .object({
          question: z
            .string()
            .min(3, "Poll question must be at least 3 characters")
            .max(300, "Poll question cannot exceed 300 characters")
            .trim(),
          options: z
            .array(
              z.object({
                text: z
                  .string()
                  .min(1, "Option text cannot be empty")
                  .max(200, "Option text cannot exceed 200 characters")
                  .trim(),
              })
            )
            .min(2, "Poll must have at least 2 options")
            .max(6, "Poll cannot have more than 6 options"),
        })
        .optional()
    ),
    event: z.preprocess(
      parseIfString,
      z
        .object({
          title: z.string().min(3, "Event title is required").trim(),
          date: z.string().min(1, "Event date is required"),
          location: z.string().min(2, "Event location is required").trim(),
        })
        .optional()
    ),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, "Post content cannot be empty")
      .max(2000, "Post content cannot exceed 2000 characters")
      .trim()
      .optional(),
    tags: z
      .array(z.string().trim().toLowerCase())
      .max(10, "Maximum 10 tags allowed")
      .optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field (content or tags) must be provided for update",
  }),
});

export const postIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Post ID format"),
  }),
});

export const feedQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    sort: z.enum(["newest", "trending"]).optional().default("newest"),
    tag: z.string().trim().toLowerCase().optional(),
    search: z.string().trim().optional(),
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>["body"];
export type UpdatePostInput = z.infer<typeof updatePostSchema>["body"];
export type FeedQueryInput = z.infer<typeof feedQuerySchema>["query"];
