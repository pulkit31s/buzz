import mongoose, { Schema, Document, Model } from "mongoose";
import { IUserDocument } from "../users/user.model";

/**
 * Interface representing a Campus Event document in MongoDB.
 */
export interface IEvent {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: mongoose.Types.ObjectId | IUserDocument;
  interestedCount: number;
  interestedBy: mongoose.Types.ObjectId[];
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventDocument extends IEvent, Document {}

const eventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [200, "Event title cannot exceed 200 characters"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxlength: [2000, "Event description cannot exceed 2000 characters"],
    },
    date: {
      type: Date,
      required: [true, "Event date and time is required"],
      index: true,
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
      maxlength: [200, "Event location cannot exceed 200 characters"],
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Event must have an organizer"],
      index: true,
    },
    interestedCount: {
      type: Number,
      default: 0,
      index: true,
    },
    interestedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ date: 1, interestedCount: -1 });

/**
 * Helper to format a raw populated Mongoose Event document into a clean client object.
 * Displays anonymous identity (`Anonymous Fox`) without exposing email or username.
 */
export const formatEventForClient = (event: IEventDocument, currentUserId?: string) => {
  const organizerDoc = event.organizer as IUserDocument;
  const isInterested = currentUserId
    ? event.interestedBy.some((id: any) => id.toString() === currentUserId.toString())
    : false;

  return {
    id: (event as any)._id.toString(),
    title: event.title,
    description: event.description,
    date: event.date.toISOString(),
    location: event.location,
    organizer: {
      id: (organizerDoc as any)._id ? (organizerDoc as any)._id.toString() : (organizerDoc as any).toString(),
      username: organizerDoc.anonymousName || "Anonymous Student",
      avatar: organizerDoc.anonymousAvatar || "",
      year: organizerDoc.year || "",
      verified: organizerDoc.verified || false,
    },
    interestedCount: event.interestedCount || 0,
    isInterested,
    image: event.image || null,
    createdAt: event.createdAt ? event.createdAt.toISOString() : new Date().toISOString(),
  };
};

export const Event: Model<IEventDocument> =
  mongoose.models.Event || mongoose.model<IEventDocument>("Event", eventSchema);
