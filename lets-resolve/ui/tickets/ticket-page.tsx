"use client";
import { PlusIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { useEffect, useState } from "react";
import Ticket from "@/lib/model/Ticket";
import TicketItem from "./ticket-item";
export default function TicketPage() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    const fetchTickets = async () => {
      const response = await fetch("http://localhost:4000/ticket/all");
      const data = await response.json();
      setTickets(data);
    };
    fetchTickets();
  }, []);
  return (
    <main className="w-full md:w-2/3 mx-auto py-6">
      <div className="flex rounded-lg  text-sm md:mx-0 h-10 flex-column ">
        <div className="w-full bg-selected">
          <button
            name="0"
            className={` w-32 h-full hover:opacity-60 items-center font-semibold flex grow text-left py-1 px-4 bg-selected`}
          >
            <AdjustmentsHorizontalIcon height={20} />
            <span className={`pl-1 font-semibold`}>Filter</span>
          </button>
        </div>
        <div className="bg-selected">
          <Link
            href={"/dashboard/tickets/create-ticket"}
            className={`grow w-32 h-full hover:opacity-60 py-1 px-4 justify-end bg-selected items-center font-semibold flex`}
          >
            <PlusIcon height={20} />
            <span className={`pl-1 font-semibold `}>New Ticket</span>
          </Link>
        </div>
      </div>
      <div>
        {tickets &&
          tickets.length > 0 &&
          tickets.map((item: Ticket) => {
            return <TicketItem key={item.TicketId} ticket={item} />;
          })}
      </div>
    </main>
  );
}
