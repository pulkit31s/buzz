import mongoose, { Schema, Document, Model } from "mongoose";
import { IUserDocument } from "../users/user.model";

/**
 * Sub-schema for Poll options embedded within a Post.
 * Tracks voters array on each option to prevent duplicate voting.
 */
export interface IPollOption {
  _id: mongoose.Types.ObjectId;
  text: string;
  votes: number;
  voters: mongoose.Types.ObjectId[];
}

export interface IPoll {
  question: string;
  options: IPollOption[];
}

export interface IPostEvent {
  title: string;
  date: string;
  location: string;
}

/**
 * Interface representing a Post document in MongoDB.
 */
export interface IPost {
  content: string;
  images: string[];
  tags: string[];
  author: mongoose.Types.ObjectId | IUserDocument;
  poll?: IPoll;
  event?: IPostEvent;
  upvotesCount: number;
  upvotedBy: mongoose.Types.ObjectId[];
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  bookmarkedBy: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPostDocument extends IPost, Document {}

const pollOptionSchema = new Schema<IPollOption>(
  {
    text: { type: String, required: true, trim: true, maxlength: 200 },
    votes: { type: Number, default: 0 },
    voters: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: true }
);

const pollSchema = new Schema<IPoll>(
  {
    question: { type: String, required: true, trim: true, maxlength: 300 },
    options: [pollOptionSchema],
  },
  { _id: false }
);

const eventSchema = new Schema<IPostEvent>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    date: { type: String, required: true },
    location: { type: String, required: true, trim: true, maxlength: 200 },
  },
  { _id: false }
);

const postSchema = new Schema<IPostDocument>(
  {
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
      maxlength: [2000, "Post content cannot exceed 2000 characters"],
      index: true,
    },
    images: {
      type: [String],
      default: [],
      validate: [
        (val: string[]) => val.length <= 4,
        "A post cannot have more than 4 images",
      ],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Post must have an author"],
      index: true,
    },
    poll: {
      type: pollSchema,
      required: false,
    },
    event: {
      type: eventSchema,
      required: false,
    },
    upvotesCount: { type: Number, default: 0, index: true },
    upvotedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },
    bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast feed retrieval and sorting
postSchema.index({ createdAt: -1 });
postSchema.index({ upvotesCount: -1, createdAt: -1 });

/**
 * Helper to transform a raw populated Mongoose Post document into the exact structure
 * expected by the Next.js frontend (`Post` interface in `features/feed/types/post.ts`).
 */
export const formatPostForClient = (
  post: IPostDocument,
  currentUserId?: string
) => {
  const authorDoc = post.author as IUserDocument;

  const isUpvoted = currentUserId
    ? post.upvotedBy.some((id: any) => id.toString() === currentUserId.toString())
    : false;

  const isBookmarked = currentUserId
    ? post.bookmarkedBy.some((id: any) => id.toString() === currentUserId.toString())
    : false;

  return {
    id: (post as any)._id.toString(),
    author: {
      id: (authorDoc as any)._id ? (authorDoc as any)._id.toString() : (authorDoc as any).toString(),
      username: authorDoc.anonymousName || "Anonymous Student",
      avatar: authorDoc.anonymousAvatar || "",
      year: authorDoc.year || "",
      verified: authorDoc.verified || false,
    },
    content: post.content,
    images: post.images || [],
    poll: post.poll
      ? {
          question: post.poll.question,
          options: post.poll.options.map((opt: any) => ({
            id: opt._id.toString(),
            text: opt.text,
            votes: opt.votes,
          })),
        }
      : undefined,
    event: post.event
      ? {
          title: post.event.title,
          date: post.event.date,
          location: post.event.location,
        }
      : undefined,
    createdAt: post.createdAt ? post.createdAt.toISOString() : new Date().toISOString(),
    stats: {
      upvotes: post.upvotesCount || 0,
      comments: post.commentsCount || 0,
      shares: post.sharesCount || 0,
      bookmarks: post.bookmarksCount || 0,
    },
    userInteraction: {
      upvoted: isUpvoted,
      bookmarked: isBookmarked,
    },
    tags: post.tags || [],
  };
};

export const Post: Model<IPostDocument> =
  mongoose.models.Post || mongoose.model<IPostDocument>("Post", postSchema);
