import Link from "next/link";
import Customer from "@/lib/model/Customer";
import Contact from "@/lib/model/Contact";
import Ticket from "@/lib/model/Ticket";
import { Button } from "../button";
import { PencilIcon } from "@heroicons/react/24/solid";
import ContactList from "./contact-list";
import AddContactForm from "./add-contact-form";
import TicketItem from "../tickets/ticket-item";
import EmptyText from "../emptyText";

export default function CustomerDetail({
  customer,
  contacts,
  tickets,
}: {
  customer: Customer;
  contacts: Contact[];
  tickets: Ticket[];
}) {
  return (
    <main className="mx-auto w-full space-y-6 py-6 md:w-2/3">
      <div className="flex items-start justify-between rounded-lg bg-secondary p-4">
        <div>
          <h1 className="text-xl font-semibold">{customer.Name}</h1>
          {customer.Domain && <p className="opacity-70">{customer.Domain}</p>}
          {customer.Notes && <p className="mt-2 text-sm">{customer.Notes}</p>}
        </div>
        <Link href={`/dashboard/customers/edit-customer/${customer.CustomerId}`}>
          <Button className="bg-secondary">
            <PencilIcon className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <section>
        <h2 className="mb-2 font-semibold">Contacts</h2>
        <AddContactForm customerId={customer.CustomerId} />
        <ContactList customerId={customer.CustomerId} contacts={contacts} />
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Tickets</h2>
        {tickets && tickets.length > 0 ? (
          tickets.map((ticket) => <TicketItem key={ticket.TicketId} ticket={ticket} />)
        ) : (
          <EmptyText text="No tickets for this customer yet" />
        )}
      </section>
    </main>
  );
}
