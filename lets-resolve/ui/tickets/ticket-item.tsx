"use client";
import Ticket from "@/lib/model/Ticket";
import { Button } from "../button";
import {
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { handleTicketDelete } from "@/lib/ticketAction";
import { useRouter } from "next/navigation";
import useAuthUser from "@/app/hooks/use-auth-user";
import { PriorityBadge, StatusBadge } from "./ticket-badges";
import Avatar from "../avatar";

export default function TicketItem({ ticket }: { ticket: Ticket }) {
  const router = useRouter();
  const user = useAuthUser();
  const onEditTicket = () => {
    router.push(`/dashboard/tickets/edit-ticket/${ticket.TicketId}`);
  };
  const handleTicketDetail = () => {
    router.push(`/dashboard/tickets/ticket/${ticket.TicketId}`);
  };
  return (
    <div className="card group flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:border-accent/30">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar label={ticket.AssignedTo} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium text-typography">{ticket.Subject}</p>
            <StatusBadge status={ticket.Status} />
            <PriorityBadge priority={ticket.Priority} />
          </div>
          <p className="mt-0.5 truncate text-sm text-muted">{ticket.AssignedTo}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <Button
          variant="ghost"
          onClick={onEditTicket}
          aria-label="Edit ticket"
          className="h-9 w-9 px-0"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        {user?.isAdmin && (
          <Button
            variant="ghost"
            onClick={() => handleTicketDelete(ticket.TicketId)}
            aria-label="Delete ticket"
            className="h-9 w-9 px-0 hover:text-danger"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        onClick={handleTicketDetail}
        aria-label="View ticket"
        className="h-9 w-9 shrink-0 px-0"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
