import { axiosClient } from "@/lib/api";
import type { CreatePostPayload, CreatePostResponse } from "../types/createPost";

export const createPostApi = {
  /**
   * POST /api/v1/posts
   * Sends multipart/form-data containing post content, images, tags, and optional poll/event.
   */
  async createPost(payload: CreatePostPayload): Promise<CreatePostResponse> {
    const formData = new FormData();

    // 1. Append content
    formData.append("content", payload.content);

    // 2. Append tags as JSON string
    if (payload.tags && payload.tags.length > 0) {
      formData.append("tags", JSON.stringify(payload.tags));
    }

    // 3. Append poll data as JSON string
    if (payload.poll && payload.poll.question && Array.isArray(payload.poll.options) && payload.poll.options.length >= 2) {
      formData.append("poll", JSON.stringify(payload.poll));
    }

    // 4. Append image files
    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      await axiosClient.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        message: "Post created successfully on campus feed!",
      };
    } catch (error: any) {
      console.error("Failed to create post:", error);
      throw new Error(error.message || "Failed to create post");
    }
  },
};