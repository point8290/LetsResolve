"use client";
import Link from "next/link";
import Customer from "@/lib/model/Customer";
import { Button } from "../button";
import {
  BuildingOffice2Icon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { handleCustomerDelete } from "@/lib/customerAction";
import { useRouter } from "next/navigation";
import useAuthUser from "@/app/hooks/use-auth-user";

export default function CustomerItem({ customer }: { customer: Customer }) {
  const router = useRouter();
  const user = useAuthUser();

  return (
    <div className="card group relative flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:border-accent/30">
      <Link
        href={`/dashboard/customers/customer/${customer.CustomerId}`}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          <BuildingOffice2Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-typography">{customer.Name}</p>
          {customer.Domain && (
            <p className="mt-0.5 truncate text-sm text-muted">{customer.Domain}</p>
          )}
        </div>
      </Link>
      <div className="flex shrink-0 items-center gap-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/customers/edit-customer/${customer.CustomerId}`)}
          aria-label="Edit customer"
          size="icon"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        {user?.isAdmin && (
          <Button
            variant="ghost"
            onClick={() => handleCustomerDelete(customer.CustomerId)}
            aria-label="Delete customer"
            size="icon"
            className="hover:text-danger"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ChevronRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
    </div>
  );
}
