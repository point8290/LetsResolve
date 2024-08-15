import { fetchTicket } from "@/lib/ticketAction";
import TicketForm from "@/ui/tickets/ticket-form";
export default async function EditTicket({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const ticket = await fetchTicket(params?.id);
  return <TicketForm isEditForm={true} ticket={ticket} />;
}
