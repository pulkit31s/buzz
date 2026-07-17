import { Router } from "express";
import {
  createEventController,
  getEventsController,
  getEventByIdController,
  toggleInterestedController,
  deleteEventController,
} from "./event.controller";
import { authenticate, optionalAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { upload } from "../../middlewares/upload.middleware";
import {
  createEventSchema,
  eventIdParamSchema,
  eventQuerySchema,
} from "./event.validation";

const router = Router();

// Public routes with optional auth for personalized RSVP status check
router.get("/", optionalAuth, validate(eventQuerySchema), getEventsController);
router.get("/:id", optionalAuth, validate(eventIdParamSchema), getEventByIdController);

// Protected routes
router.use(authenticate);

router.post("/", upload.single("image"), validate(createEventSchema), createEventController);
router.post("/:id/interested", validate(eventIdParamSchema), toggleInterestedController);
router.delete("/:id", validate(eventIdParamSchema), deleteEventController);

export default router;
