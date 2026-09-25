import { z } from "zod";

export const createContactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(200),
  email: z.string().trim().email("email must be a valid email"),
  phone: z.string().trim().max(30).optional(),
});
export type CreateContactInput = z.infer<typeof createContactSchema>;

export const updateContactSchema = z.object({
  name: z.string().trim().min(2).max(200).optional(),
  email: z.string().trim().email("email must be a valid email").optional(),
  phone: z.string().trim().max(30).optional(),
});
export type UpdateContactInput = z.infer<typeof updateContactSchema>;
