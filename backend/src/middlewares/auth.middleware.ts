import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { User, IUserDocument } from "../features/users/user.model";
import { asyncHandler } from "../utils/asyncHandler";

interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

/**
 * Authentication Middleware:
 * Verifies JWT from `Authorization: Bearer <token>` or HTTP-only `token` cookie.
 * Populates `req.user` with the authenticated Mongoose user document.
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    // 1. Extract token from Authorization header or Cookie
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new ApiError(401, "Authentication required. Please log in to access this resource.");
    }

    try {
      // 2. Verify JWT token
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

      // 3. Find user in database (exclude password)
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new ApiError(401, "User associated with this token no longer exists.");
      }

      // 4. Attach user to Request object
      req.user = user;
      next();
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(401, "Invalid or expired authentication token. Please log in again.");
    }
  }
);

/**
 * Optional Authentication Middleware:
 * Checks for token and attaches `req.user` if present and valid,
 * but allows request to continue even if unauthenticated (useful for public feeds with personalized upvote/bookmark stats).
 */
export const optionalAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Silently ignore token verification errors for optional auth
    }

    next();
  }
);
