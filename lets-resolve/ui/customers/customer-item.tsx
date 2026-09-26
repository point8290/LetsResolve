"use client";
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
    <div className="card group flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:border-accent/30">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          <BuildingOffice2Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-typography">{customer.Name}</p>
          {customer.Domain && (
            <p className="mt-0.5 truncate text-sm text-muted">{customer.Domain}</p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/customers/edit-customer/${customer.CustomerId}`)}
          aria-label="Edit customer"
          className="h-9 w-9 px-0"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
        {user?.isAdmin && (
          <Button
            variant="ghost"
            onClick={() => handleCustomerDelete(customer.CustomerId)}
            aria-label="Delete customer"
            className="h-9 w-9 px-0 hover:text-danger"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        onClick={() => router.push(`/dashboard/customers/customer/${customer.CustomerId}`)}
        aria-label="View customer"
        className="h-9 w-9 shrink-0 px-0"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
