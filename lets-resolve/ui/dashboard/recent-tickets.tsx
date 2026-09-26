import Link from "next/link";
import Ticket from "@/lib/model/Ticket";
import { StatusBadge } from "@/ui/tickets/ticket-badges";
import EmptyText from "@/ui/emptyText";

export default function RecentTickets({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="card p-5">
      <h2 className="panel-heading">Recent activity</h2>
      {tickets.length === 0 ? (
        <EmptyText text="No tickets yet" />
      ) : (
        <ul className="mt-3 divide-y divide-separator">
          {tickets.map((ticket) => (
            <li key={ticket.TicketId}>
              <Link
                href={`/dashboard/tickets/ticket/${ticket.TicketId}`}
                className="flex items-center justify-between gap-3 rounded-md px-1 py-2.5 text-sm transition-colors hover:bg-shadow"
              >
                <span className="truncate text-typography">{ticket.Subject}</span>
                <StatusBadge status={ticket.Status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
