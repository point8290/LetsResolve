export const COMMENT_TYPES = [
  "comment",
  "status_change",
  "priority_change",
  "assignment",
] as const;
export type CommentType = (typeof COMMENT_TYPES)[number];

export default interface Comment {
  TicketId: string;
  // Sort key: `${CreatedAt}#${CommentId}` so a Query naturally returns
  // comments and system activity entries in chronological order without a
  // secondary index.
  SortKey: string;
  CommentId: string;
  Type: CommentType;
  Body: string;
  AuthorEmail: string;
  CreatedAt: string;
}
