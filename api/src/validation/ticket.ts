import { z } from "zod";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "../model/Ticket";

export const createTicketSchema = z.object({
  subject: z.string().trim().min(4, "Subject must be at least 4 characters").max(200),
  description: z.string().trim().max(5000).optional().default(""),
  assignedTo: z.string().trim().email("assignedTo must be a valid email"),
  status: z.enum(TICKET_STATUSES).optional().default("open"),
  priority: z.enum(TICKET_PRIORITIES).optional().default("medium"),
  customerId: z.string().trim().min(1).optional(),
  contactId: z.string().trim().min(1).optional(),
});
export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = z.object({
  subject: z.string().trim().min(4).max(200).optional(),
  description: z.string().trim().max(5000).optional(),
  assignedTo: z.string().trim().email("assignedTo must be a valid email").optional(),
  status: z.enum(TICKET_STATUSES).optional(),
  priority: z.enum(TICKET_PRIORITIES).optional(),
  customerId: z.string().trim().min(1).optional(),
  contactId: z.string().trim().min(1).optional(),
});
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
