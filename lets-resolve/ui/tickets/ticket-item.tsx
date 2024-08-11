import Ticket from "@/lib/model/Ticket";
import { Button } from "../button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { handleTicketDelete } from "@/lib/ticketAction";
import { Dispatch, SetStateAction } from "react";
export default function TicketItem({
  ticket,
  setRefreshTickets,
}: {
  ticket: Ticket;
  setRefreshTickets: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex justify-between items-center bg-secondary rounded-lg px-4 py-2 my-2">
      <div>
        <p className="font-bold">{ticket.Subject}</p>
        <p>{ticket.Description}</p>
      </div>
      <div className="flex gap-2">
        <Button className="w-full bg-secondary">
          <PencilIcon className=" h-4 w-4 " />
        </Button>
        <Button className="w-full bg-secondary">
          <TrashIcon
            onClick={() =>
              handleTicketDelete(ticket.TicketId, setRefreshTickets)
            }
            className=" h-4 w-4 "
          />
        </Button>
      </div>
    </div>
  );
}
