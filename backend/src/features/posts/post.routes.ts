import { Router } from "express";
import {
  createPostController,
  getFeedController,
  getPostByIdController,
  updatePostController,
  deletePostController,
  toggleUpvoteController,
  votePollController,
} from "./post.controller";
import { toggleBookmarkController } from "../bookmarks/bookmark.controller";
import { createCommentController, getPostCommentsController } from "../comments/comment.controller";
import { authenticate, optionalAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { upload } from "../../middlewares/upload.middleware";
import {
  createPostSchema,
  updatePostSchema,
  postIdParamSchema,
  feedQuerySchema,
} from "./post.validation";
import { createCommentSchema } from "../comments/comment.validation";

const router = Router();

// Feed endpoints support optional auth (to calculate upvoted/bookmarked interaction state per user if logged in)
router.get("/", optionalAuth, validate(feedQuerySchema), getFeedController);
router.get("/:id", optionalAuth, validate(postIdParamSchema), getPostByIdController);
router.get("/:id/comments", optionalAuth, validate(postIdParamSchema), getPostCommentsController);

// Protected mutation routes
router.use(authenticate);

router.post(
  "/",
  upload.array("images", 4),
  validate(createPostSchema),
  createPostController
);

router.patch(
  "/:id",
  validate(postIdParamSchema),
  validate(updatePostSchema),
  updatePostController
);

router.delete("/:id", validate(postIdParamSchema), deletePostController);

// REST interaction routes matching exact API Structure requirements
router.post("/:id/upvote", validate(postIdParamSchema), toggleUpvoteController);
router.post("/:id/bookmark", validate(postIdParamSchema), toggleBookmarkController);
router.post("/:id/comment", validate(postIdParamSchema), validate(createCommentSchema), createCommentController);
router.post("/:id/poll/vote", validate(postIdParamSchema), votePollController);

export default router;
