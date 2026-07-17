import { Router } from "express";
import { getMeController, updateMeController } from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateProfileSchema } from "./user.validation";

const router = Router();

// All user endpoints require authentication
router.use(authenticate);

router.get("/me", getMeController);
router.patch("/me", validate(updateProfileSchema), updateMeController);

export default router;
