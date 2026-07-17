import { axiosClient } from "@/lib/api";
import { Post } from "../types/post";

export interface FeedQueryParams {
  page?: number;
  limit?: number;
  sort?: "newest" | "trending";
  tag?: string;
  search?: string;
}

/**
 * Connected Feed API
 * Communicates with Buzz Node/Express Backend (`http://localhost:5000/api/v1/posts`)
 */
export const feedApi = {
  /**
   * Fetch paginated feed posts
   */
  async getFeed(params?: FeedQueryParams): Promise<Post[]> {
    try {
      const data = await axiosClient.get("/posts", { params });
      if (data && typeof data === "object" && "posts" in data) {
        return (data as any).posts;
      }
      return Array.isArray(data) ? (data as any) : [];
    } catch (error) {
      console.error("Failed to fetch feed from backend:", error);
      throw error;
    }
  },

  /**
   * Fetch a single post by ID
   */
  async getPost(postId: string): Promise<Post | null> {
    try {
      const data = await axiosClient.get(`/posts/${postId}`);
      return (data as any) as Post;
    } catch (error) {
      console.error(`Failed to fetch post ${postId}:`, error);
      return null;
    }
  },

  /**
   * Toggle upvote state for a post
   */
  async toggleUpvote(postId: string): Promise<{ upvoted: boolean; upvotesCount: number }> {
    const data = await axiosClient.post(`/posts/${postId}/upvote`);
    return (data as any) as { upvoted: boolean; upvotesCount: number };
  },

  /**
   * Toggle bookmark state for a post
   */
  async toggleBookmark(postId: string): Promise<{ bookmarked: boolean; bookmarksCount: number }> {
    const data = await axiosClient.post(`/posts/${postId}/bookmark`);
    return (data as any) as { bookmarked: boolean; bookmarksCount: number };
  },

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<void> {
    await axiosClient.delete(`/posts/${postId}`);
  },
};