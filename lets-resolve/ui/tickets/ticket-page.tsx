import { PlusIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Ticket from "@/lib/model/Ticket";
import TicketItem from "./ticket-item";
import { fetchTickets } from "@/lib/ticketAction";
import EmptyText from "../emptyText";

export default async function TicketPage() {
  const tickets = await fetchTickets();

  return (
    <main className="w-full md:w-2/3 mx-auto py-6">
      <div className="flex rounded-lg  text-sm md:mx-0 h-10 flex-column ">
        <div className="w-1/2 bg-secondary">
          <button
            name="0"
            className={` h-full hover:opacity-60 items-center font-semibold flex grow text-left py-1 px-4 bg-secondary`}
          >
            <AdjustmentsHorizontalIcon height={20} />
            <span className={`pl-1 font-semibold`}>Filter</span>
          </button>
        </div>
        <div className="w-1/2 flex bg-secondary">
          <Link
            href={"/dashboard/tickets/create-ticket"}
            className={`grow h-full hover:opacity-60 py-1 px-4 justify-end bg-secondary items-center font-semibold flex`}
          >
            <PlusIcon height={20} />
            <span className={`pl-1 font-semibold `}>New Ticket</span>
          </Link>
        </div>
      </div>
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
