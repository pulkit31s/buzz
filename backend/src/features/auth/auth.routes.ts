import { Router } from "express";
import { registerController, loginController, logoutController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "./auth.validation";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);

// Protected routes
router.post("/logout", authenticate, logoutController);

export default router;
