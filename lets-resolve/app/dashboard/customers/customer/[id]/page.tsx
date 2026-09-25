import { fetchCustomer } from "@/lib/customerAction";
import { fetchContacts } from "@/lib/contactAction";
import { fetchTicketsForCustomer } from "@/lib/ticketAction";
import CustomerDetail from "@/ui/customers/customer-detail";

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [customer, contactsPage, ticketsPage] = await Promise.all([
    fetchCustomer(params.id),
    fetchContacts(params.id),
    fetchTicketsForCustomer(params.id),
  ]);

  return (
    <CustomerDetail
      customer={customer}
      contacts={contactsPage.items}
      tickets={ticketsPage.items}
    />
  );
}
