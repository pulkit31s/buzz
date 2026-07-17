import { Request, Response } from "express";
import { toggleBookmarkService, getUserBookmarksService } from "./bookmark.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

/**
 * POST /api/v1/posts/:id/bookmark
 * Controller handler to toggle bookmark state for a post.
 */
export const toggleBookmarkController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Authentication required to bookmark posts");
    }

    const postId = (req.params.id || req.params.postId) as string;
    const result = await toggleBookmarkService(postId, req.user._id.toString());

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          result.bookmarked ? "Post bookmarked" : "Bookmark removed"
        )
      );
  }
);

/**
 * GET /api/v1/bookmarks
 * Controller handler to retrieve paginated list of posts bookmarked by the user.
 */
export const getUserBookmarksController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "Authentication required");
    }

    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const bookmarks = await getUserBookmarksService(req.user._id.toString(), page, limit);

    res.status(200).json(new ApiResponse(200, bookmarks, "Bookmarks retrieved successfully"));
  }
);
