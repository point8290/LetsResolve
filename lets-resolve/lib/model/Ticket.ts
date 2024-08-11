export default interface Ticket {
  TicketId: string;
  Subject: string;
  Description: string | undefined;
  AssignedTo: string;
  Attachments: string[] | undefined;
  CreatedAt: string;
  UpdatedAt: string;
}
