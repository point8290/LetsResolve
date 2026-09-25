export const TICKET_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "closed",
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export default interface Ticket {
  TicketId: string;
  Subject: string;
  Description: string | undefined;
  Status: TicketStatus;
  Priority: TicketPriority;
  AssignedTo: string;
  CustomerId?: string;
  ContactId?: string;
  Attachments: string[] | undefined;
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy?: string;
}
