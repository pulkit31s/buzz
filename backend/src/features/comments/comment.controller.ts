import { Request, Response } from "express";
import {
  createCommentService,
  getPostCommentsService,
  updateCommentService,
  deleteCommentService,
} from "./comment.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

/**
 * POST /api/v1/comments/post/:postId
 * Controller handler for creating a top-level or nested comment.
 */
export const createCommentController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Authentication required to comment");
    }

    const postId = (req.params.postId || req.params.id) as string;
    const comment = await createCommentService(postId, req.user._id.toString(), req.body);

    res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"));
  }
);

/**
 * GET /api/v1/comments/post/:postId
 * Controller handler to fetch all comments for a given post.
 */
export const getPostCommentsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const postId = (req.params.postId || req.params.id) as string;
    const currentUserId = req.user?._id?.toString();
    const comments = await getPostCommentsService(postId, currentUserId);

    res.status(200).json(new ApiResponse(200, comments, "Comments fetched successfully"));
  }
);

/**
 * PATCH /api/v1/comments/:id
 * Controller handler to update comment content (Author only).
 */
export const updateCommentController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Authentication required");
    }

    const comment = await updateCommentService(req.params.id as string, req.user._id.toString(), req.body);
    res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"));
  }
);

/**
 * DELETE /api/v1/comments/:id
 * Controller handler to delete a comment (Author only).
 */
export const deleteCommentController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Authentication required");
    }

    await deleteCommentService(req.params.id as string, req.user._id.toString());
    res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
  }
);
