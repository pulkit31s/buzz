import { Request, Response } from "express";
import {
  createEventService,
  getEventsService,
  getEventByIdService,
  toggleInterestedService,
  deleteEventService,
} from "./event.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

/**
 * POST /api/v1/events
 * Controller handler for creating a new campus event with optional banner image.
 */
export const createEventController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user._id) throw new ApiError(401, "Authentication required to create an event");
  const file = req.file as Express.Multer.File | undefined;
  const event = await createEventService(req.user._id.toString(), req.body, file);
  res.status(201).json(new ApiResponse(201, event, "Event created successfully"));
});

/**
 * GET /api/v1/events
 * Controller handler for retrieving paginated campus events (`upcoming`, `past`, `all`).
 */
export const getEventsController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user?._id?.toString();
  const eventsData = await getEventsService(req.query as any, currentUserId);
  res.status(200).json(new ApiResponse(200, eventsData, "Events retrieved successfully"));
});

/**
 * GET /api/v1/events/:id
 * Controller handler for fetching single event details.
 */
export const getEventByIdController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user?._id?.toString();
  const event = await getEventByIdService(req.params.id as string, currentUserId);
  res.status(200).json(new ApiResponse(200, event, "Event retrieved successfully"));
});

/**
 * POST /api/v1/events/:id/interested
 * Controller handler for toggling RSVP / Interested status.
 */
export const toggleInterestedController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user._id) throw new ApiError(401, "Authentication required");
  const result = await toggleInterestedService(req.params.id as string, req.user._id.toString());
  res.status(200).json(new ApiResponse(200, result, result.isInterested ? "Marked as interested" : "Removed from interested"));
});

/**
 * DELETE /api/v1/events/:id
 * Controller handler for deleting an event (Organizer only).
 */
export const deleteEventController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user._id) throw new ApiError(401, "Authentication required");
  await deleteEventService(req.params.id as string, req.user._id.toString());
  res.status(200).json(new ApiResponse(200, null, "Event deleted successfully"));
});
