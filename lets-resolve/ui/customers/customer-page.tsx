import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Customer from "@/lib/model/Customer";
import CustomerItem from "./customer-item";
import { fetchCustomers } from "@/lib/customerAction";
import EmptyText from "../emptyText";

export default async function CustomerPage() {
  const { items: customers } = await fetchCustomers();

  return (
    <main className="mx-auto w-full max-w-4xl py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-typography">
            Customers
          </h1>
          <p className="mt-1 text-sm text-muted">
            Accounts, contacts, and the tickets tied to them.
          </p>
        </div>
        <Link
          href={"/dashboard/customers/create-customer"}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-buttons px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-buttons-hover"
        >
          <PlusIcon className="h-4 w-4" />
          New customer
        </Link>
      </div>

      <div className="mt-6 space-y-2.5">
        {customers && customers.length > 0 ? (
          customers.map((item: Customer) => (
            <CustomerItem key={item.CustomerId} customer={item} />
          ))
        ) : (
          <EmptyText text={"No customers yet"} />
        )}
      </div>
    </main>
  );
}
