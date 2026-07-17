import mongoose, { Schema, Document, Model } from "mongoose";
import { IUserDocument } from "../users/user.model";

/**
 * Interface representing a Comment document in MongoDB.
 * Supports nested replies via `parentComment` self-reference.
 */
export interface IComment {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId | IUserDocument;
  content: string;
  parentComment?: mongoose.Types.ObjectId | null;
  upvotesCount: number;
  upvotedBy: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICommentDocument extends IComment, Document {}

const commentSchema = new Schema<ICommentDocument>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a post"],
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comment must have an author"],
      index: true,
    },
    content: {
      type: String,
      required: [true, "Comment content cannot be empty"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true, // Enables fast retrieval of child replies for any given parent comment
    },
    upvotesCount: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ post: 1, createdAt: 1 });

/**
 * Helper to format a raw populated Mongoose Comment document into a clean client object.
 * Displays anonymous identity (`Anonymous Fox`) without exposing email or username.
 */
export const formatCommentForClient = (
  comment: ICommentDocument,
  currentUserId?: string
) => {
  const authorDoc = comment.author as IUserDocument;
  const isUpvoted = currentUserId
    ? comment.upvotedBy.some((id: any) => id.toString() === currentUserId.toString())
    : false;

  return {
    id: (comment as any)._id.toString(),
    postId: comment.post.toString(),
    author: {
      id: (authorDoc as any)._id ? (authorDoc as any)._id.toString() : (authorDoc as any).toString(),
      username: authorDoc.anonymousName || "Anonymous Student",
      avatar: authorDoc.anonymousAvatar || "",
      year: authorDoc.year || "",
      verified: authorDoc.verified || false,
    },
    content: comment.content,
    parentCommentId: comment.parentComment ? comment.parentComment.toString() : null,
    upvotesCount: comment.upvotesCount || 0,
    isUpvoted,
    createdAt: comment.createdAt ? comment.createdAt.toISOString() : new Date().toISOString(),
  };
};

export const Comment: Model<ICommentDocument> =
  mongoose.models.Comment || mongoose.model<ICommentDocument>("Comment", commentSchema);
