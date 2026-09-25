"use client";
import Link from "next/link";
import Ticket from "@/lib/model/Ticket";
import Customer from "@/lib/model/Customer";
import { Button } from "../button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { handleTicketDelete } from "@/lib/ticketAction";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuthUser from "@/app/hooks/use-auth-user";
import { PriorityBadge, StatusBadge } from "./ticket-badges";

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
    <div className="mx-auto flex flex-col bg-secondary md:w-2/3 my-4 p-4 rounded-lg">
      <div className="grid grid-cols-2">
        <div className="flex items-center">
          <div className="relative h-[50px] w-[50px] aspect-square">
            <Image src="/logo.png" fill className="object-cover" alt="avatar" />
          </div>
          <div className="pl-2">
            <strong>{ticket.AssignedTo}</strong>
            {customer && (
              <p className="text-sm opacity-70">
                <Link
                  href={`/dashboard/customers/customer/${customer.CustomerId}`}
                  className="hover:underline"
                >
                  {customer.Name}
                </Link>
              </p>
            )}
          </div>
        </div>
        <div className="text-center">
          <div className="flex justify-center gap-2">
            <StatusBadge status={ticket.Status} />
            <PriorityBadge priority={ticket.Priority} />
          </div>
          <p className="mt-1 font-semibold">{ticket.Subject}</p>
          <p>{ticket.Description}</p>
        </div>
        {ticket.Attachments && ticket.Attachments.length > 0 && (
          <div className="col-span-2 flex items-center mt-8 w-full">
            {ticket.Attachments.map((url, index) => {
              return (
                <div
                  key={`attachment-${url.substring(url.length - 5)}`}
                  className="relative h-[180px] w-[180px] aspect-video"
                >
                  <Image
                    src={url}
                    fill
                    className="object-cover"
                    alt={`attachment-${index}`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex items-center mt-8 justify-around">
        <Button onClick={onEditTicket} aria-label="Edit ticket" className="bg-secondary">
          <PencilIcon className=" h-6 w-6 " />
        </Button>
        {user?.isAdmin && (
          <Button
            onClick={() => handleTicketDelete(ticket.TicketId)}
            aria-label="Delete ticket"
            className="bg-secondary"
          >
            <TrashIcon className=" h-6 w-6 " />
          </Button>
        )}
      </div>
    </div>
  );
}
