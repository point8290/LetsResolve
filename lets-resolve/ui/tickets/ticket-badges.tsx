import clsx from "clsx";
import {
  TicketPriority,
  TicketStatus,
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
} from "@/lib/model/Ticket";

const STATUS_STYLES: Record<TicketStatus, string> = {
  open: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-200 text-gray-700",
};

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const BADGE_CLASSES = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium";

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={clsx(BADGE_CLASSES, STATUS_STYLES[status])}>
      {TICKET_STATUS_LABELS[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={clsx(BADGE_CLASSES, PRIORITY_STYLES[priority])}>
      {TICKET_PRIORITY_LABELS[priority]}
    </span>
  );
}
