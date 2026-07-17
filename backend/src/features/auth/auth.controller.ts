import { Request, Response } from "express";
import { registerService, loginService } from "./auth.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { env } from "../../config/env";

/**
 * Cookie configuration options for storing authentication tokens securely.
 */
const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: (env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
});

/**
 * POST /api/v1/auth/register
 * Controller handler for new campus user registration.
 */
export const registerController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { user, accessToken, refreshToken } = await registerService(req.body);

    res
      .status(201)
      .cookie("token", accessToken, getCookieOptions())
      .cookie("refreshToken", refreshToken, {
        ...getCookieOptions(),
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      .json(
        new ApiResponse(
          201,
          { user, accessToken, refreshToken },
          "User registered successfully. Welcome to Buzz!"
        )
      );
  }
);

/**
 * POST /api/v1/auth/login
 * Controller handler for existing user authentication.
 */
export const loginController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { user, accessToken, refreshToken } = await loginService(req.body);

    res
      .status(200)
      .cookie("token", accessToken, getCookieOptions())
      .cookie("refreshToken", refreshToken, {
        ...getCookieOptions(),
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken },
          "Logged in successfully."
        )
      );
  }
);

/**
 * POST /api/v1/auth/logout
 * Controller handler to clear authentication cookies and log out user.
 */
export const logoutController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    res
      .status(200)
      .clearCookie("token", getCookieOptions())
      .clearCookie("refreshToken", getCookieOptions())
      .json(new ApiResponse(200, null, "Logged out successfully."));
  }
);
