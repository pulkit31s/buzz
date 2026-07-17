import dotenv from "dotenv";
import { z } from "zod";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Zod schema for environment variable validation
 * Guarantees fail-fast behavior if required env variables are missing or malformed on startup.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default("5000"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required for database connection"),
  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters long"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLOUDINARY_NAME: z.string().optional().default(""),
  CLOUDINARY_KEY: z.string().optional().default(""),
  CLOUDINARY_SECRET: z.string().optional().default(""),
  CLIENT_URL: z.string().default("http://localhost:3000"),
});

// Parse and validate process.env
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;
