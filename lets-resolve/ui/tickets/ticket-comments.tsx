import Comment from "@/lib/model/Comment";
import AddCommentForm from "./add-comment-form";
import Avatar from "../avatar";
import {
  ArrowPathRoundedSquareIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import EmptyText from "../emptyText";

const ACTIVITY_ICON: Record<Comment["Type"], typeof ChatBubbleLeftIcon> = {
  comment: ChatBubbleLeftIcon,
  status_change: ArrowPathRoundedSquareIcon,
  priority_change: ArrowTrendingUpIcon,
  assignment: UserIcon,
};

export default function TicketComments({
  ticketId,
  comments,
}: {
  ticketId: string;
  comments: Comment[];
}) {
  return (
    <div className="card mx-auto my-6 p-6 md:w-2/3">
      <h2 className="panel-heading">Activity</h2>
      {comments.length === 0 ? (
        <EmptyText text="No comments yet" />
      ) : (
        <ul className="mt-4 space-y-4">
          {comments.map((comment) => {
            if (comment.Type === "comment") {
              return (
                <li key={comment.CommentId} className="flex gap-3">
                  <Avatar label={comment.AuthorEmail} size="sm" />
                  <div className="min-w-0 flex-1 rounded-xl bg-shadow px-3.5 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-typography">
                        {comment.AuthorEmail}
                      </span>
                      <span className="shrink-0 text-xs text-muted">
                        {new Date(comment.CreatedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-typography">
                      {comment.Body}
                    </p>
                  </div>
                </li>
              );
            }

            const Icon = ACTIVITY_ICON[comment.Type];
            return (
              <li key={comment.CommentId} className="flex items-center gap-3 pl-1 text-xs text-muted">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>
                  <span className="font-medium text-typography">{comment.AuthorEmail}</span>{" "}
                  {comment.Body}
                </span>
                <span className="ml-auto shrink-0">
                  {new Date(comment.CreatedAt).toLocaleString()}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <AddCommentForm ticketId={ticketId} />
    </div>
  );
}
