"use client";
import Ticket from "@/lib/model/Ticket";
import { Button } from "../button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { handleTicketDelete } from "@/lib/ticketAction";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TicketDetail({ ticket }: { ticket: Ticket }) {
  const router = useRouter();
  const onEditTicket = () => {
    router.push(`/dashboard/Tickets/edit-Ticket/${ticket.TicketId}`);
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
          </div>
        </div>
        <div className="text-center">
          <p>{ticket.Subject}</p>
          <p>{ticket.Description}</p>
        </div>
        {ticket.Attachments && ticket.Attachments.length > 0 && (
          <div className="col-span-2 flex items-center mt-8 w-full">
            {ticket.Attachments.map((url, index) => {
              console.log(url);
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
        <Button onClick={onEditTicket} className="bg-secondary">
          <PencilIcon className=" h-6 w-6 " />
        </Button>
        <Button
          onClick={() => handleTicketDelete(ticket.TicketId)}
          className="bg-secondary"
        >
          <TrashIcon className=" h-6 w-6 " />
        </Button>
      </div>
    </div>
  );
}
