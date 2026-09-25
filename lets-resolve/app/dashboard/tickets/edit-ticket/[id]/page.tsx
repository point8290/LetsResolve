import { fetchTicket } from "@/lib/ticketAction";
import { fetchCustomers } from "@/lib/customerAction";
import TicketForm from "@/ui/tickets/ticket-form";
export default async function EditTicket({
  params,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [ticket, customersPage] = await Promise.all([
    fetchTicket(params?.id),
    fetchCustomers(),
  ]);
  return <TicketForm isEditForm={true} ticket={ticket} customers={customersPage.items} />;
}
