import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { env } from "./env";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";

// Configure Cloudinary credentials
if (env.CLOUDINARY_NAME && env.CLOUDINARY_KEY && env.CLOUDINARY_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_NAME,
    api_key: env.CLOUDINARY_KEY,
    api_secret: env.CLOUDINARY_SECRET,
  });
} else {
  logger.warn("⚠️ Cloudinary credentials not configured in environment variables. Image uploads will fail if attempted.");
}

/**
 * Uploads a single file buffer from memory buffer directly to Cloudinary.
 * Never stores binary files locally on disk.
 *
 * @param fileBuffer - Raw Buffer from multer memoryStorage
 * @param folder - Cloudinary destination folder (default: 'buzz/posts')
 * @returns Cloudinary UploadApiResponse containing secure_url
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "buzz/posts"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    if (!env.CLOUDINARY_NAME || !env.CLOUDINARY_KEY || !env.CLOUDINARY_SECRET) {
      return reject(
        new ApiError(500, "Cloudinary image storage is not configured on the server")
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 1200, height: 1200, crop: "limit", quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          logger.error("❌ Cloudinary upload failed:", error);
          return reject(new ApiError(500, "Failed to upload image to cloud storage"));
        }
        if (!result) {
          return reject(new ApiError(500, "Cloudinary upload returned no result"));
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Uploads an array of Multer memory files to Cloudinary concurrently.
 */
export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
  folder: string = "buzz/posts"
): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer, folder));
  const results = await Promise.all(uploadPromises);

  return results.map((res) => res.secure_url);
};
