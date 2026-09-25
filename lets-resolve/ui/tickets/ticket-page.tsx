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
    <main className="w-full md:w-2/3 mx-auto py-6">
      <div className="flex rounded-lg  text-sm md:mx-0 h-10 flex-column ">
        <div className="w-full flex bg-secondary">
          <Link
            href={"/dashboard/tickets/create-ticket"}
            className={`grow h-full hover:opacity-60 py-1 px-4 justify-end bg-secondary items-center font-semibold flex`}
          >
            <PlusIcon height={20} />
            <span className={`pl-1 font-semibold `}>New Ticket</span>
          </Link>
        </div>
      </div>
      <TicketFilters activeStatus={searchParams?.status} />
      <div>
        {tickets && tickets.length > 0 ? (
          tickets.map((item: Ticket) => {
            return <TicketItem key={item.TicketId} ticket={item} />;
          })
        ) : (
          <EmptyText text={"No Tickets"} />
        )}
      </div>
    </main>
  );
}
