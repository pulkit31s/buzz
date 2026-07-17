import { Request, Response } from "express";
import { getProfileService, updateProfileService } from "./user.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

/**
 * GET /api/v1/users/me
 * Controller handler to return authenticated user's current profile.
 */
export const getMeController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "User not authenticated");
    }

    const user = await getProfileService(req.user._id.toString());
    res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
  }
);

/**
 * PATCH /api/v1/users/me
 * Controller handler to update authenticated user's profile information.
 */
export const updateMeController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, "User not authenticated");
    }

    const updatedUser = await updateProfileService(req.user._id.toString(), req.body);
    res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
  }
);
