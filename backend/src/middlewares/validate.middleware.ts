import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

/**
 * Reusable request validation middleware using Zod schemas.
 * Validates req.body, req.query, and req.params cleanly before reaching controllers.
 */
export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Forward Zod errors directly to the global errorHandler
        next(error);
      } else {
        next(error);
      }
    }
  };
