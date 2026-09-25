import Comment from "@/lib/model/Comment";
import AddCommentForm from "./add-comment-form";
import EmptyText from "../emptyText";

const ACTIVITY_PREFIX: Record<Comment["Type"], string> = {
  comment: "",
  status_change: "↻ ",
  priority_change: "↑ ",
  assignment: "→ ",
};

export default function TicketComments({
  ticketId,
  comments,
}: {
  ticketId: string;
  comments: Comment[];
}) {
  return (
    <div className="mx-auto md:w-2/3 my-4 rounded-lg bg-secondary p-4">
      <h2 className="mb-2 font-semibold">Activity</h2>
      {comments.length === 0 ? (
        <EmptyText text="No comments yet" />
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.CommentId} className="rounded-md bg-ternary p-3 text-sm">
              <div className="flex items-center justify-between opacity-70">
                <span>{comment.AuthorEmail}</span>
                <span>{new Date(comment.CreatedAt).toLocaleString()}</span>
              </div>
              <p className="mt-1">
                {ACTIVITY_PREFIX[comment.Type]}
                {comment.Body}
              </p>
            </li>
          ))}
        </ul>
      )}
      <AddCommentForm ticketId={ticketId} />
    </div>
  );
}
