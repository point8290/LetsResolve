import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(200),
  domain: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(5000).optional(),
});
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = z.object({
  name: z.string().trim().min(2).max(200).optional(),
  domain: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(5000).optional(),
});
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
