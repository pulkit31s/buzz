import multer from "multer";
import { Request } from "express";
import { ApiError } from "../utils/ApiError";

/**
 * Multer memory storage configuration.
 * Stores incoming files as Buffers in RAM (`req.files`) so they can be streamed directly to Cloudinary.
 * Never writes image binaries to local disk.
 */
const storage = multer.memoryStorage();

/**
 * File filter to ensure only image formats are accepted.
 */
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Unsupported image format (${file.mimetype}). Allowed: JPEG, PNG, WEBP, GIF`));
  }
};

/**
 * Reusable Multer upload instance:
 * - Storage: RAM Memory
 * - File Size Limit: 5 MB per image
 * - Max Files: 4 images per post
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 4, // Maximum 4 images
  },
});
