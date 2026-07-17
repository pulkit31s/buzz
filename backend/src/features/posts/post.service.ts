import { Post, formatPostForClient } from "./post.model";
import { CreatePostInput, UpdatePostInput, FeedQueryInput } from "./post.validation";
import { uploadMultipleToCloudinary } from "../../config/cloudinary";
import { ApiError } from "../../utils/ApiError";

/**
 * Service: Create a new post with optional Cloudinary image uploads and Poll/Event attachments.
 */
export const createPostService = async (
  userId: string,
  payload: CreatePostInput,
  files?: Express.Multer.File[]
) => {
  // 1. Upload images to Cloudinary if provided
  let imageUrls: string[] = [];
  if (files && files.length > 0) {
    imageUrls = await uploadMultipleToCloudinary(files, "buzz/posts");
  }

  // Helper in case stringified JSON slips through without preprocessing
  const parseMaybeString = (val: any) => {
    if (typeof val === "string") {
      try { return JSON.parse(val); } catch { return val; }
    }
    return val;
  };

  const pollObj = parseMaybeString(payload.poll);
  const pollData = (pollObj && pollObj.question && Array.isArray(pollObj.options) && pollObj.options.length > 0)
    ? {
        question: pollObj.question,
        options: pollObj.options.map((opt: any) => ({
          text: typeof opt === "string" ? opt : (opt?.text || ""),
          votes: 0,
          voters: [],
        })),
      }
    : undefined;

  const tagsObj = parseMaybeString(payload.tags);
  const tagsData = Array.isArray(tagsObj) ? tagsObj : [];

  const eventObj = parseMaybeString(payload.event);
  const eventData = (eventObj && eventObj.title && eventObj.date && eventObj.location) ? eventObj : undefined;

  // 3. Create post document in MongoDB
  const post = await Post.create({
    content: payload.content,
    tags: tagsData,
    images: imageUrls,
    poll: pollData,
    event: eventData,
    author: userId,
  });

  // Populate author before formatting for client
  await post.populate("author");

  return formatPostForClient(post, userId);
};

/**
 * Service: Fetch paginated feed posts with filtering, searching, and sorting.
 * Supports infinite scroll via page & limit parameters.
 */
export const getFeedService = async (
  query: FeedQueryInput,
  currentUserId?: string
) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  // Build dynamic MongoDB query filter
  const filter: Record<string, any> = {};

  if (query.tag) {
    filter.tags = query.tag;
  }

  if (query.search) {
    filter.content = { $regex: query.search, $options: "i" };
  }

  // Determine sorting order (`newest` or `trending`)
  const sortOrder: Record<string, 1 | -1> =
    query.sort === "trending"
      ? { upvotesCount: -1, createdAt: -1 }
      : { createdAt: -1 };

  // Execute query with pagination and author population
  const [posts, totalCount] = await Promise.all([
    Post.find(filter)
      .sort(sortOrder)
      .skip(skip)
      .limit(limit)
      .populate("author"),
    Post.countDocuments(filter),
  ]);

  const formattedPosts = posts.map((post: any) => formatPostForClient(post, currentUserId));

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

/**
 * Service: Fetch a single post by ID
 */
export const getPostByIdService = async (
  postId: string,
  currentUserId?: string
) => {
  const post = await Post.findById(postId).populate("author");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  return formatPostForClient(post, currentUserId);
};

/**
 * Service: Update post content or tags (Author only)
 */
export const updatePostService = async (
  postId: string,
  userId: string,
  payload: UpdatePostInput
) => {
  const post = await Post.findById(postId).populate("author");
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Verify authorship
  const authorId = (post.author as any)._id ? (post.author as any)._id.toString() : (post.author as any).toString();
  if (authorId !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this post");
  }

  if (payload.content !== undefined) post.content = payload.content;
  if (payload.tags !== undefined) post.tags = payload.tags;

  await post.save();
  return formatPostForClient(post, userId);
};

/**
 * Service: Delete a post (Author only)
 */
export const deletePostService = async (postId: string, userId: string): Promise<void> => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const authorId = post.author.toString();
  if (authorId !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  await post.deleteOne();
};

/**
 * Service: Toggle upvote state for a post (`POST /posts/:id/upvote`).
 * Prevents duplicate upvotes and atomically syncs `upvotesCount`.
 */
export const toggleUpvoteService = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const isUpvoted = post.upvotedBy.some((id: any) => id.toString() === userId.toString());
  let upvotedStatus = false;

  if (isUpvoted) {
    // Remove upvote and decrement count
    post.upvotedBy = post.upvotedBy.filter((id: any) => id.toString() !== userId.toString());
    post.upvotesCount = Math.max(0, post.upvotesCount - 1);
    upvotedStatus = false;
  } else {
    // Add upvote and increment count
    post.upvotedBy.push(userId as any);
    post.upvotesCount += 1;
    upvotedStatus = true;
  }

  await post.save();

  return {
    upvoted: upvotedStatus,
    upvotesCount: post.upvotesCount,
  };
};

/**
 * Service: Vote on a Poll option (`POST /posts/:id/poll/vote`).
 * Prevents duplicate votes per user across the entire poll.
 */
export const votePollService = async (postId: string, userId: string, optionId: string) => {
  const post = await Post.findById(postId);
  if (!post || !post.poll) {
    throw new ApiError(404, "Poll not found on this post");
  }

  // Check if user has already voted on any option
  let hasAlreadyVoted = false;
  for (const option of post.poll.options) {
    if (option.voters.some((id: any) => id.toString() === userId.toString())) {
      hasAlreadyVoted = true;
      break;
    }
  }

  if (hasAlreadyVoted) {
    throw new ApiError(409, "You have already voted in this poll. Duplicate votes are prevented.");
  }

  // Find target option
  const targetOption = post.poll.options.find((opt: any) => opt._id.toString() === optionId);
  if (!targetOption) {
    throw new ApiError(404, "Poll option not found");
  }

  targetOption.voters.push(userId as any);
  targetOption.votes += 1;

  await post.save();

  return {
    poll: {
      question: post.poll.question,
      options: post.poll.options.map((opt: any) => ({
        id: opt._id.toString(),
        text: opt.text,
        votes: opt.votes,
      })),
    },
  };
};
