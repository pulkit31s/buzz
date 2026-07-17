import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

/**
 * Connects to MongoDB Atlas using Mongoose.
 * Implements connection event listeners and graceful shutdown handling.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);

    // Listen for connection events
    mongoose.connection.on("error", (err) => {
      logger.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
    });
  } catch (error: any) {
    logger.error(`❌ Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Handle graceful shutdown when Node process exits
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed through app termination (SIGINT)");
  process.exit(0);
});
