import { Comment, formatCommentForClient } from "./comment.model";
import { CreateCommentInput, UpdateCommentInput } from "./comment.validation";
import { Post } from "../posts/post.model";
import { ApiError } from "../../utils/ApiError";

/**
 * Service: Create a new comment or nested reply on a post.
 * Atomically increments the post's `commentsCount`.
 */
export const createCommentService = async (
  postId: string,
  userId: string,
  payload: CreateCommentInput
) => {
  // 1. Verify that target post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // 2. If parentComment is specified, verify it exists and belongs to the same post
  if (payload.parentComment) {
    const parent = await Comment.findById(payload.parentComment);
    if (!parent) {
      throw new ApiError(404, "Parent comment not found");
    }
    if (parent.post.toString() !== postId.toString()) {
      throw new ApiError(400, "Parent comment does not belong to this post");
    }
  }

  // 3. Create comment document
  const comment = await Comment.create({
    post: postId,
    author: userId,
    content: payload.content,
    parentComment: payload.parentComment || null,
  });

  // 4. Atomically increment comment count on post
  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

  // 5. Populate author cleanly
  await comment.populate("author");

  return formatCommentForClient(comment, userId);
};

/**
 * Service: Fetch all comments for a post, structured for nested threading.
 */
export const getPostCommentsService = async (postId: string, currentUserId?: string) => {
  const postExists = await Post.exists({ _id: postId });
  if (!postExists) {
    throw new ApiError(404, "Post not found");
  }

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: 1 })
    .populate("author");

  const formattedComments = comments.map((comment: any) =>
    formatCommentForClient(comment, currentUserId)
  );

  return formattedComments;
};

/**
 * Service: Update comment content (Author only)
 */
export const updateCommentService = async (
  commentId: string,
  userId: string,
  payload: UpdateCommentInput
) => {
  const comment = await Comment.findById(commentId).populate("author");
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const authorId = comment.author._id ? comment.author._id.toString() : comment.author.toString();
  if (authorId !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  comment.content = payload.content;
  await comment.save();

  return formatCommentForClient(comment, userId);
};

/**
 * Service: Delete comment (Author only).
 * Decrements post comment count.
 */
export const deleteCommentService = async (commentId: string, userId: string): Promise<void> => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const authorId = comment.author.toString();
  if (authorId !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await comment.deleteOne();
  await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
};
