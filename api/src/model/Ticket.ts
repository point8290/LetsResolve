export const TICKET_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "closed",
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export default interface Ticket {
  TicketId: string;
  Subject: string;
  Description: string;
  Status: TicketStatus;
  Priority: TicketPriority;
  AssignedTo: string;
  CustomerId?: string;
  ContactId?: string;
  Attachments: string[];
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy?: string;
}
