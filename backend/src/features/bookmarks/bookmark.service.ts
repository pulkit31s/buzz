import { Post, formatPostForClient } from "../posts/post.model";
import { ApiError } from "../../utils/ApiError";

/**
 * Service: Toggle bookmark status for a post.
 * Prevents duplicate bookmarks and atomically syncs `bookmarksCount`.
 */
export const toggleBookmarkService = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const isBookmarked = post.bookmarkedBy.some(
    (id: any) => id.toString() === userId.toString()
  );

  let bookmarkedStatus = false;

  if (isBookmarked) {
    // Remove bookmark and decrement counter
    post.bookmarkedBy = post.bookmarkedBy.filter(
      (id: any) => id.toString() !== userId.toString()
    );
    post.bookmarksCount = Math.max(0, post.bookmarksCount - 1);
    bookmarkedStatus = false;
  } else {
    // Add bookmark and increment counter
    post.bookmarkedBy.push(userId as any);
    post.bookmarksCount += 1;
    bookmarkedStatus = true;
  }

  await post.save();

  return {
    bookmarked: bookmarkedStatus,
    bookmarksCount: post.bookmarksCount,
  };
};

/**
 * Service: Fetch all posts bookmarked by the current user with pagination.
 */
export const getUserBookmarksService = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [posts, totalCount] = await Promise.all([
    Post.find({ bookmarkedBy: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author"),
    Post.countDocuments({ bookmarkedBy: userId }),
  ]);

  const formattedPosts = posts.map((post: any) => formatPostForClient(post, userId));

  return {
    posts: formattedPosts,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page * limit < totalCount,
    },
  };
};
