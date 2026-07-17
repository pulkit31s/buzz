import { Request, Response, NextFunction } from "express";

/**
 * Higher-order utility wrapper for async Express route handlers.
 * Automatically catches rejections and passes them to the centralized error middleware via next(err).
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
