import { fetchCustomers } from "@/lib/customerAction";
import TicketForm from "@/ui/tickets/ticket-form";

export default async function CreateTicket() {
  const { items: customers } = await fetchCustomers();
  return <TicketForm isEditForm={false} ticket={undefined} customers={customers} />;
}
