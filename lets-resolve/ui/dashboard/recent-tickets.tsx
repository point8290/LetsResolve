import Link from "next/link";
import Ticket from "@/lib/model/Ticket";
import { StatusBadge } from "@/ui/tickets/ticket-badges";
import EmptyText from "@/ui/emptyText";

export default function RecentTickets({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="rounded-lg bg-secondary p-4">
      <h2 className="mb-3 font-semibold">Recent activity</h2>
      {tickets.length === 0 ? (
        <EmptyText text="No tickets yet" />
      ) : (
        <ul className="space-y-1">
          {tickets.map((ticket) => (
            <li key={ticket.TicketId}>
              <Link
                href={`/dashboard/tickets/ticket/${ticket.TicketId}`}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1 text-sm hover:bg-ternary"
              >
                <span className="truncate">{ticket.Subject}</span>
                <StatusBadge status={ticket.Status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
