"use client";
import Ticket from "@/lib/model/Ticket";
import { Button } from "../button";
import {
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { handleTicketDelete } from "@/lib/ticketAction";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuthUser from "@/app/hooks/use-auth-user";
import { PriorityBadge, StatusBadge } from "./ticket-badges";

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
    <div className="flex justify-between items-center bg-secondary rounded-lg px-4 py-2 my-2">
      <div className="flex items-center gap-2">
        <div className="relative h-[50px] w-[50px] aspect-square">
          <Image src="/logo.png" fill className="object-cover" alt="avatar" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <strong>{ticket.AssignedTo}</strong>
            <StatusBadge status={ticket.Status} />
            <PriorityBadge priority={ticket.Priority} />
          </div>
          <p>{ticket.Subject}</p>
          <p>{ticket.Description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onEditTicket} aria-label="Edit ticket" className="w-full bg-secondary">
          <PencilIcon className=" h-4 w-4 " />
        </Button>
        {user?.isAdmin && (
          <Button
            onClick={() => handleTicketDelete(ticket.TicketId)}
            aria-label="Delete ticket"
            className="w-full bg-secondary"
          >
            <TrashIcon className=" h-4 w-4 " />
          </Button>
        )}
        <Button
          onClick={() => handleTicketDetail()}
          aria-label="View ticket"
          className="w-full bg-secondary"
        >
          <ChevronRightIcon className=" h-4 w-4 " />
        </Button>
      </div>
    </div>
  );
}
