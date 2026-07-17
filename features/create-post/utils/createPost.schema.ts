import { z } from "zod";
import { POST_TAGS } from "../constants/tags";

export const MAX_POST_LENGTH = 500;
export const MAX_IMAGES = 5;
export const MAX_POLL_OPTIONS = 4;
export const MIN_POLL_OPTIONS = 2;

const pollOptionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Poll option cannot be empty")
    .max(100, "Poll option must be under 100 characters"),
});

export const createPostSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1, "Post cannot be empty")
      .max(
        MAX_POST_LENGTH,
        `Post cannot exceed ${MAX_POST_LENGTH} characters`
      ),

    images: z.array(z.instanceof(File)).max(
      MAX_IMAGES,
      `You can upload up to ${MAX_IMAGES} images`
    ),

    tags: z
      .array(z.enum(POST_TAGS))
      .min(1, "Select at least one category")
      .max(3, "You can select up to 3 categories"),

    poll: z
      .object({
        question: z
          .string()
          .trim()
          .min(1, "Poll question is required")
          .max(120, "Poll question must be under 120 characters"),

        options: z
          .array(pollOptionSchema)
          .min(
            MIN_POLL_OPTIONS,
            `At least ${MIN_POLL_OPTIONS} options are required`
          )
          .max(
            MAX_POLL_OPTIONS,
            `Maximum ${MAX_POLL_OPTIONS} options allowed`
          ),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.poll) {
      const options = data.poll.options.map((option) =>
        option.text.trim().toLowerCase()
      );

      const duplicates = options.filter(
        (option, index) => options.indexOf(option) !== index
      );

      if (duplicates.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["poll", "options"],
          message: "Poll options must be unique",
        });
      }
    }

    const hasContent = data.content.trim().length > 0;
    const hasImages = data.images.length > 0;
    const hasPoll = !!data.poll;

    if (!hasContent && !hasImages && !hasPoll) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["content"],
        message: "Create a post by adding text, images, or a poll.",
      });
    }
  });

export type CreatePostFormValues = z.infer<typeof createPostSchema>;    