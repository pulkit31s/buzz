import { Router } from "express";
import {
  createCommentController,
  getPostCommentsController,
  updateCommentController,
  deleteCommentController,
} from "./comment.controller";
import { authenticate, optionalAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  createCommentSchema,
  updateCommentSchema,
  commentIdParamSchema,
  postCommentParamSchema,
} from "./comment.validation";

const router = Router();

// Get all comments for a specific post
router.get("/post/:postId", optionalAuth, validate(postCommentParamSchema), getPostCommentsController);

// Protected routes
router.use(authenticate);

// Create comment on a post
router.post("/post/:postId", validate(postCommentParamSchema), validate(createCommentSchema), createCommentController);

// Update and delete specific comment by ID
router.patch("/:id", validate(commentIdParamSchema), validate(updateCommentSchema), updateCommentController);
router.delete("/:id", validate(commentIdParamSchema), deleteCommentController);

export default router;
