import { Event, formatEventForClient } from "./event.model";
import { CreateEventInput, UpdateEventInput, EventQueryInput } from "./event.validation";
import { uploadToCloudinary } from "../../config/cloudinary";
import { ApiError } from "../../utils/ApiError";

/**
 * Service: Create a new campus event with optional banner image upload.
 */
export const createEventService = async (
  userId: string,
  payload: CreateEventInput,
  file?: Express.Multer.File
) => {
  let imageUrl: string | undefined;
  if (file) {
    const uploadResult = await uploadToCloudinary(file.buffer, "buzz/events");
    imageUrl = uploadResult.secure_url;
  }

  const event = await Event.create({
    title: payload.title,
    description: payload.description,
    date: new Date(payload.date),
    location: payload.location,
    organizer: userId,
    image: imageUrl,
  });

  await event.populate("organizer");
  return formatEventForClient(event, userId);
};

/**
 * Service: Fetch paginated campus events (supports filtering upcoming/past/all and searching).
 */
export const getEventsService = async (query: EventQueryInput, currentUserId?: string) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  if (query.filter === "upcoming") {
    filter.date = { $gte: new Date() };
  } else if (query.filter === "past") {
    filter.date = { $lt: new Date() };
  }

  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { location: { $regex: query.search, $options: "i" } },
    ];
  }

  // Sort upcoming events chronologically (soonest first), past events by most recent
  const sortOrder = query.filter === "past" ? { date: -1 } : { date: 1 };

  const [events, totalCount] = await Promise.all([
    Event.find(filter).sort(sortOrder as any).skip(skip).limit(limit).populate("organizer"),
    Event.countDocuments(filter),
  ]);

  const formattedEvents = events.map((event: any) => formatEventForClient(event, currentUserId));

  return {
    events: formattedEvents,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page * limit < totalCount,
    },
  };
};

/**
 * Service: Fetch single event by ID
 */
export const getEventByIdService = async (eventId: string, currentUserId?: string) => {
  const event = await Event.findById(eventId).populate("organizer");
  if (!event) throw new ApiError(404, "Event not found");
  return formatEventForClient(event, currentUserId);
};

/**
 * Service: Toggle 'Interested' state for a user on an event.
 * Prevents duplicate RSVP counters.
 */
export const toggleInterestedService = async (eventId: string, userId: string) => {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, "Event not found");

  const isInterested = event.interestedBy.some((id: any) => id.toString() === userId.toString());
  let interestedStatus = false;

  if (isInterested) {
    event.interestedBy = event.interestedBy.filter((id: any) => id.toString() !== userId.toString());
    event.interestedCount = Math.max(0, event.interestedCount - 1);
    interestedStatus = false;
  } else {
    event.interestedBy.push(userId as any);
    event.interestedCount += 1;
    interestedStatus = true;
  }

  await event.save();
  return { isInterested: interestedStatus, interestedCount: event.interestedCount };
};

/**
 * Service: Delete event (Organizer only)
 */
export const deleteEventService = async (eventId: string, userId: string): Promise<void> => {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, "Event not found");

  const organizerId = event.organizer.toString();
  if (organizerId !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this event");
  }

  await event.deleteOne();
};
