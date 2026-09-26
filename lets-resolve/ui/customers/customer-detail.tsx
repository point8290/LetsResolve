import Link from "next/link";
import Customer from "@/lib/model/Customer";
import Contact from "@/lib/model/Contact";
import Ticket from "@/lib/model/Ticket";
import { Button } from "../button";
import { PencilIcon } from "@heroicons/react/24/outline";
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
    <main className="mx-auto w-full max-w-4xl space-y-6 py-8">
      <div className="card flex items-start justify-between gap-4 p-6">
        <div>
          <h1 className="font-display text-xl font-semibold text-typography">
            {customer.Name}
          </h1>
          {customer.Domain && <p className="text-sm text-muted">{customer.Domain}</p>}
          {customer.Notes && (
            <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-typography">
              {customer.Notes}
            </p>
          )}
        </div>
        <Link href={`/dashboard/customers/edit-customer/${customer.CustomerId}`}>
          <Button variant="ghost" aria-label="Edit customer">
            <PencilIcon className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <section className="card p-6">
        <h2 className="panel-heading">Contacts</h2>
        <div className="mt-4">
          <AddContactForm customerId={customer.CustomerId} />
        </div>
        <div className="mt-4">
          <ContactList customerId={customer.CustomerId} contacts={contacts} />
        </div>
      </section>

      <section>
        <h2 className="panel-heading mb-3">Tickets</h2>
        {tickets && tickets.length > 0 ? (
          <div className="space-y-2.5">
            {tickets.map((ticket) => (
              <TicketItem key={ticket.TicketId} ticket={ticket} />
            ))}
          </div>
        ) : (
          <EmptyText text="No tickets for this customer yet" />
        )}
      </section>
    </main>
  );
}
