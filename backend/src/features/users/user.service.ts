import { User, IUserDocument } from "./user.model";
import { UpdateProfileInput } from "./user.validation";
import { ApiError } from "../../utils/ApiError";

/**
 * Service: Fetch current user profile cleanly from MongoDB
 */
export const getProfileService = async (userId: string): Promise<IUserDocument> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User profile not found");
  }
  return user;
};

/**
 * Service: Update current user profile fields
 * Handles username uniqueness verification and automatic avatar syncing when anonymousName changes.
 */
export const updateProfileService = async (
  userId: string,
  payload: UpdateProfileInput
): Promise<IUserDocument> => {
  // 1. If username is being changed, verify it isn't already taken by another user
  if (payload.username) {
    const existingUser = await User.findOne({
      username: payload.username,
      _id: { $ne: userId },
    });

    if (existingUser) {
      throw new ApiError(409, "This username is already taken by another student");
    }
  }

  // 2. Prepare update payload
  const updateData: Record<string, any> = { ...payload };

  // If anonymous identity (`Anonymous Fox`, `Owl`, etc.) is changed, sync the avatar SVG
  if (payload.anonymousName) {
    const animalSeed = payload.anonymousName.split(" ")[1].toLowerCase();
    updateData.anonymousAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${animalSeed}`;
  }

  // 3. Perform atomic update and return updated document
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new ApiError(404, "User profile not found");
  }

  return updatedUser;
};
