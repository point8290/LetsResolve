import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().trim().min(4, "Title must be at least 4 characters").max(200),
  description: z.string().trim().max(20000).optional().default(""),
  author: z.string().trim().email("author must be a valid email"),
});
export type CreateArticleInput = z.infer<typeof createArticleSchema>;

export const updateArticleSchema = z.object({
  title: z.string().trim().min(4).max(200).optional(),
  description: z.string().trim().max(20000).optional(),
  author: z.string().trim().email("author must be a valid email").optional(),
});
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
