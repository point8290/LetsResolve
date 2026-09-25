import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny, z } from "zod";

/**
 * Validates & coerces `req.body` against a zod schema, replacing it with the
 * parsed (and type-narrowed) result. Multer parses multipart text fields as
 * strings, so every schema this feeds should expect string input and coerce
 * as needed.
 */
export function validateBody<T extends ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body ?? {}) as z.infer<T>;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json({ error: "Validation failed", details: error.flatten() });
      }
      next(error);
    }
  };
}
