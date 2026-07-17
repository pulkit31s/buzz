import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { logger } from "./utils/logger";

/**
 * Server initialization:
 * 1. Connects to MongoDB Atlas
 * 2. Creates HTTP server wrapped around Express app
 * 3. Prepares Socket.IO architecture for real-time campus feeds & notifications
 * 4. Starts listening on the configured PORT
 */
const bootstrapServer = async () => {
  try {
    // 1. Establish database connection
    await connectDB();

    // 2. Create HTTP server instance
    const httpServer = http.createServer(app);

    // 3. Prepare Socket.IO real-time architecture (future scalability)
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: env.CLIENT_URL,
        credentials: true,
      },
    });

    // Attach io instance to express app so controllers can trigger real-time events when needed
    app.set("io", io);

    io.on("connection", (socket) => {
      logger.info(`🔌 New Socket.IO client connected: ${socket.id}`);

      socket.on("disconnect", () => {
        logger.info(`🔌 Socket.IO client disconnected: ${socket.id}`);
      });
    });

    // 4. Start HTTP & WebSocket server
    httpServer.listen(env.PORT, () => {
      logger.info(`🚀 Buzz Backend running in [${env.NODE_ENV}] mode on port ${env.PORT}`);
      logger.info(`🌐 API available at http://localhost:${env.PORT}/api/v1/health`);
    });

    // Handle uncaught exceptions and unhandled rejections globally
    process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
      logger.error(`🚨 Unhandled Rejection at: ${promise}, reason: ${reason?.message || reason}`);
      httpServer.close(() => process.exit(1));
    });

    process.on("uncaughtException", (error: Error) => {
      logger.error(`🚨 Uncaught Exception thrown: ${error.message}`, error.stack);
      process.exit(1);
    });
  } catch (error: any) {
    logger.error(`❌ Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

bootstrapServer();
