import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Customer from "@/lib/model/Customer";
import CustomerItem from "./customer-item";
import { fetchCustomers } from "@/lib/customerAction";
import EmptyText from "../emptyText";

export default async function CustomerPage() {
  const { items: customers } = await fetchCustomers();

  return (
    <main className="w-full md:w-2/3 mx-auto py-6">
      <div className="flex rounded-lg text-sm md:mx-0 h-10 flex-column">
        <div className="w-full flex bg-secondary">
          <Link
            href={"/dashboard/customers/create-customer"}
            className={`grow h-full hover:opacity-60 py-1 px-4 justify-end bg-secondary items-center font-semibold flex`}
          >
            <PlusIcon height={20} />
            <span className={`pl-1 font-semibold`}>New Customer</span>
          </Link>
        </div>
      </div>
      <div>
        {customers && customers.length > 0 ? (
          customers.map((item: Customer) => (
            <CustomerItem key={item.CustomerId} customer={item} />
          ))
        ) : (
          <EmptyText text={"No Customers"} />
        )}
      </div>
    </main>
  );
}
