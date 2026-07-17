import { Router } from "express";
import { getUserBookmarksController } from "./bookmark.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getUserBookmarksController);

export default router;
