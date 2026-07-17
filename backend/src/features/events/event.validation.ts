import { z } from "zod";

export const createEventSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, "Event title must be at least 3 characters")
      .max(200, "Event title cannot exceed 200 characters")
      .trim(),
    description: z
      .string()
      .min(10, "Event description must be at least 10 characters")
      .max(2000, "Event description cannot exceed 2000 characters")
      .trim(),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Please provide a valid ISO date string (e.g. 2026-08-15T10:00:00Z)",
      }),
    location: z
      .string()
      .min(2, "Location must be at least 2 characters")
      .max(200, "Location cannot exceed 200 characters")
      .trim(),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).trim().optional(),
    description: z.string().min(10).max(2000).trim().optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }).optional(),
    location: z.string().min(2).max(200).trim().optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update the event",
  }),
});

export const eventIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Event ID format"),
  }),
});

export const eventQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    filter: z.enum(["upcoming", "past", "all"]).optional().default("upcoming"),
    search: z.string().trim().optional(),
  }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>["body"];
export type UpdateEventInput = z.infer<typeof updateEventSchema>["body"];
export type EventQueryInput = z.infer<typeof eventQuerySchema>["query"];
