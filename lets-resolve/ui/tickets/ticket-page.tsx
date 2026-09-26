import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Ticket from "@/lib/model/Ticket";
import TicketItem from "./ticket-item";
import TicketFilters from "./ticket-filters";
import { fetchTickets } from "@/lib/ticketAction";
import EmptyText from "../emptyText";

export default async function TicketPage({
  searchParams,
}: {
  searchParams?: { status?: string; priority?: string };
}) {
  const { items: tickets } = await fetchTickets({
    status: searchParams?.status,
    priority: searchParams?.priority,
  });

  return (
    <main className="mx-auto w-full max-w-4xl py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-typography">
            Tickets
          </h1>
          <p className="mt-1 text-sm text-muted">
            Track and resolve support requests.
          </p>
        </div>
        <Link
          href={"/dashboard/tickets/create-ticket"}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-buttons px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-buttons-hover"
        >
          <PlusIcon className="h-4 w-4" />
          New ticket
        </Link>
      </div>

      <TicketFilters activeStatus={searchParams?.status} />

      <div className="space-y-2.5">
        {tickets && tickets.length > 0 ? (
          tickets.map((item: Ticket) => {
            return <TicketItem key={item.TicketId} ticket={item} />;
          })
        ) : (
          <EmptyText text={"No tickets yet"} />
        )}
      </div>
    </main>
  );
}
