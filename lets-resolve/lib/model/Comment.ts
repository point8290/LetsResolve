export type CommentType = "comment" | "status_change" | "priority_change" | "assignment";

export default interface Comment {
  TicketId: string;
  SortKey: string;
  CommentId: string;
  Type: CommentType;
  Body: string;
  AuthorEmail: string;
  CreatedAt: string;
}
