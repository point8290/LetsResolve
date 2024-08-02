"use client";
import { PlusIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { font } from "../fonts";
import clsx from "clsx";
export default function TicketPage() {
  return (
    <main className="w-full md:w-2/3 mx-auto py-8">
      <div className="flex rounded mx-2 text-sm md:mx-0  flex-column mb-4">
        <button
          name="0"
          className={` rounded-l-lg  items-center font-semibold flex grow text-left py-1 px-4 bg-selected`}
        >
          <AdjustmentsHorizontalIcon height={20} />
          <span className={`pl-1 font-medium ${font.className}`}>Filter</span>
        </button>
        <Link
          href={"/dashboard/tickets/create-ticket"}
          className={`grow rounded-r-lg py-1 px-4 justify-end bg-selected items-center font-semibold flex`}
        >
          <PlusIcon height={20} />
          <span className={`pl-1 font-medium ${font.className}`}>
            New Ticket
          </span>
        </Link>
      </div>
    </main>
  );
}
