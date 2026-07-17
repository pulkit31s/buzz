import { axiosClient } from "@/lib/api";

export interface CommentAuthor {
  id: string;
  username: string;
  avatar?: string;
  year?: string;
  verified?: boolean;
}

export interface CommentItem {
  _id?: string;
  id: string;
  post: string;
  author: CommentAuthor;
  content: string;
  parentComment?: string | null;
  upvotesCount: number;
  upvotedBy?: string[];
  userUpvoted?: boolean;
  createdAt: string;
}

export const commentApi = {
  /**
   * GET /api/v1/comments/post/:postId
   */
  async getCommentsByPost(postId: string): Promise<CommentItem[]> {
    try {
      const data = await axiosClient.get(`/comments/post/${postId}`);
      return Array.isArray(data) ? ((data as any) as CommentItem[]) : [];
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      return [];
    }
  },

  /**
   * POST /api/v1/comments/post/:postId
   */
  async createComment(postId: string, content: string, parentComment?: string): Promise<CommentItem> {
    const data = await axiosClient.post(`/comments/post/${postId}`, {
      content,
      parentComment: parentComment || null,
    });
    return (data as any) as CommentItem;
  },

  /**
   * POST /api/v1/comments/:id/upvote
   */
  async toggleUpvoteComment(commentId: string): Promise<{ upvoted: boolean; upvotesCount: number }> {
    const data = await axiosClient.post(`/comments/${commentId}/upvote`);
    return (data as any) as { upvoted: boolean; upvotesCount: number };
  },
};
