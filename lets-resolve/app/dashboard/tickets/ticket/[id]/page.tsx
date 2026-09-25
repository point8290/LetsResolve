import { fetchTicket } from "@/lib/ticketAction";
import { fetchCustomer } from "@/lib/customerAction";
import { fetchComments } from "@/lib/commentAction";
import TicketDetail from "@/ui/tickets/ticket-detail";
import TicketComments from "@/ui/tickets/ticket-comments";

export default async function EditTicket({
  params,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const ticket = await fetchTicket(params?.id);
  const [customer, commentsPage] = await Promise.all([
    ticket.CustomerId ? fetchCustomer(ticket.CustomerId).catch(() => undefined) : undefined,
    fetchComments(ticket.TicketId),
  ]);

  return (
    <>
      <TicketDetail ticket={ticket} customer={customer} />
      <TicketComments ticketId={ticket.TicketId} comments={commentsPage.items} />
    </>
  );
}
