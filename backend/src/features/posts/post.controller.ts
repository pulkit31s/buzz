import { Request, Response } from "express";
import {
  createPostService,
  getFeedService,
  getPostByIdService,
  updatePostService,
  deletePostService,
  toggleUpvoteService,
  votePollService,
} from "./post.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

/**
 * POST /api/v1/posts
 * Controller handler for creating a new post with multipart/form-data images and poll options.
 */
export const createPostController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Authentication required to create a post");
    }

    const files = req.files as Express.Multer.File[] | undefined;
    const post = await createPostService(req.user._id.toString(), req.body, files);

    res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
  }
);

/**
 * GET /api/v1/posts
 * Controller handler for retrieving paginated feed posts with optional tag filtering, search, and sorting.
 */
export const getFeedController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user?._id?.toString();
    const feedData = await getFeedService(req.query as any, currentUserId);

    res.status(200).json(new ApiResponse(200, feedData, "Feed retrieved successfully"));
  }
);

/**
 * GET /api/v1/posts/:id
 * Controller handler for retrieving a single post by ID.
 */
export const getPostByIdController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user?._id?.toString();
    const post = await getPostByIdService(req.params.id as string, currentUserId);

    res.status(200).json(new ApiResponse(200, post, "Post retrieved successfully"));
  }
);

/**
 * PATCH /api/v1/posts/:id
 * Controller handler for updating post content or tags (Author only).
 */
export const updatePostController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Authentication required");
    }

    const post = await updatePostService(req.params.id as string, req.user._id.toString(), req.body);
    res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
  }
);

/**
 * DELETE /api/v1/posts/:id
 * Controller handler for deleting a post (Author only).
 */
export const deletePostController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user._id) throw new ApiError(401, "Authentication required");
  await deletePostService(req.params.id as string, req.user._id.toString());
  res.status(200).json(new ApiResponse(200, null, "Post deleted successfully"));
});

export const toggleUpvoteController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user._id) throw new ApiError(401, "Authentication required to upvote");
  const result = await toggleUpvoteService(req.params.id as string, req.user._id.toString());
  res.status(200).json(new ApiResponse(200, result, result.upvoted ? "Upvoted successfully" : "Upvote removed"));
});

export const votePollController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user || !req.user._id) throw new ApiError(401, "Authentication required to vote in polls");
  const { optionId } = req.body;
  if (!optionId) throw new ApiError(400, "optionId is required to vote");
  const result = await votePollService(req.params.id as string, req.user._id.toString(), optionId);
  res.status(200).json(new ApiResponse(200, result, "Vote recorded successfully"));
});
