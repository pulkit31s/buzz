import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";
import { env } from "../config/env";
import { ZodError } from "zod";

/**
 * 404 Not Found Middleware
 * Intercepts requests that didn't match any registered route and throws a 404 ApiError.
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};

/**
 * Centralized Global Error Handler Middleware
 * Intercepts all errors thrown across controllers, services, Zod validations, and Mongoose operations.
 * Standardizes API responses into { success: false, message: string, errors?: any }
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // 1. Handle Zod validation errors
  if (err instanceof ZodError || err.name === "ZodError") {
    statusCode = 400;
    message = "Validation Error";
    errors = err.errors?.map((error: any) => ({
      field: error.path.join("."),
      message: error.message,
    })) || err.issues;
  }

  // 2. Handle Mongoose CastError (e.g. malformed ObjectId in URL parameter)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid resource identifier: ${err.path}`;
  }

  // 3. Handle Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for ${field}. Please choose another value.`;
  }

  // 4. Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Schema Validation Failed";
    errors = Object.values(err.errors || {}).map((val: any) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // 5. Handle JWT Authentication Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token. Please log in again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired. Please log in again.";
  }

  // Log error details for internal diagnostics
  if (statusCode >= 500) {
    logger.error(`[INTERNAL ERROR] ${req.method} ${req.originalUrl} - ${message}`, err.stack);
  } else {
    logger.warn(`[API ERROR] (${statusCode}) ${req.method} ${req.originalUrl} - ${message}`);
  }

  // Build the standardized JSON response payload
  const responsePayload: Record<string, any> = {
    success: false,
    message,
  };

  if (errors && (Array.isArray(errors) ? errors.length > 0 : Object.keys(errors).length > 0)) {
    responsePayload.errors = errors;
  }

  // Include stack trace only during development mode
  if (env.NODE_ENV === "development") {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};
