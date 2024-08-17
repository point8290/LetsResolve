import { fetchTicket } from "@/lib/ticketAction";
import TicketDetail from "@/ui/tickets/ticket-detail";
export default async function EditTicket({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const ticket = await fetchTicket(params?.id);
  return <TicketDetail ticket={ticket} />;
}
