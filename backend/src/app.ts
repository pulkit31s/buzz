import express, { Express, Request, Response } from "express";
import "express-async-errors";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { ApiResponse } from "./utils/ApiResponse";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";

import authRoutes from "./features/auth/auth.routes";
import userRoutes from "./features/users/user.routes";
import postRoutes from "./features/posts/post.routes";
import commentRoutes from "./features/comments/comment.routes";
import bookmarkRoutes from "./features/bookmarks/bookmark.routes";
import eventRoutes from "./features/events/event.routes";

// Initialize Express application
const app: Express = express();

// ==========================================
// 1. Security & HTTP Middlewares
// ==========================================
app.use(helmet()); // Secure HTTP response headers
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Request body and cookie parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// HTTP Request Logging via Morgan & Logger
if (env.NODE_ENV !== "test") {
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms", {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );
}

// ==========================================
// 2. Health Check & Root Route
// ==========================================
app.get("/api/v1/health", (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, { status: "UP", timestamp: new Date().toISOString() }, "Buzz API is running smoothly"));
});

// ==========================================
// 3. Feature Routes Registration
// ==========================================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/bookmarks", bookmarkRoutes);
app.use("/api/v1/events", eventRoutes);

// ==========================================
// 4. 404 & Centralized Error Handlers
// ==========================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
