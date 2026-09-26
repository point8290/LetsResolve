"use client";
import Link from "next/link";
import Ticket from "@/lib/model/Ticket";
import Customer from "@/lib/model/Customer";
import { Button } from "../button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { handleTicketDelete } from "@/lib/ticketAction";
import { useRouter } from "next/navigation";
import useAuthUser from "@/app/hooks/use-auth-user";
import { PriorityBadge, StatusBadge } from "./ticket-badges";
import Avatar from "../avatar";

export default function TicketDetail({
  ticket,
  customer,
}: {
  ticket: Ticket;
  customer: Customer | undefined;
}) {
  const router = useRouter();
  const user = useAuthUser();
  const onEditTicket = () => {
    router.push(`/dashboard/tickets/edit-ticket/${ticket.TicketId}`);
  };

  return (
    <div className="card mx-auto my-6 flex flex-col gap-5 p-6 md:w-2/3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Avatar label={ticket.AssignedTo} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={ticket.Status} />
              <PriorityBadge priority={ticket.Priority} />
            </div>
            <h1 className="mt-1.5 font-display text-xl font-semibold text-typography">
              {ticket.Subject}
            </h1>
            <p className="text-sm text-muted">
              Assigned to {ticket.AssignedTo}
              {customer && (
                <>
                  {" "}
                  &middot;{" "}
                  <Link
                    href={`/dashboard/customers/customer/${customer.CustomerId}`}
                    className="font-medium text-accent hover:underline"
                  >
                    {customer.Name}
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" onClick={onEditTicket} aria-label="Edit ticket">
            <PencilIcon className="h-4 w-4" />
          </Button>
          {user?.isAdmin && (
            <Button
              variant="ghost"
              onClick={() => handleTicketDelete(ticket.TicketId)}
              aria-label="Delete ticket"
              className="hover:text-danger"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {ticket.Description && (
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-typography">
          {ticket.Description}
        </p>
      )}

      {ticket.Attachments && ticket.Attachments.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {ticket.Attachments.map((url, index) => (
            <a
              key={`attachment-${url.substring(url.length - 12)}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-[120px] w-[120px] overflow-hidden rounded-lg border border-separator bg-shadow bg-cover bg-center transition-opacity hover:opacity-80"
              style={{ backgroundImage: `url(${url})` }}
              aria-label={`Open attachment ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
