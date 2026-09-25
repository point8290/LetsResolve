"use client";
import Customer from "@/lib/model/Customer";
import { Button } from "../button";
import {
  BuildingOffice2Icon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { handleCustomerDelete } from "@/lib/customerAction";
import { useRouter } from "next/navigation";
import useAuthUser from "@/app/hooks/use-auth-user";

export default function CustomerItem({ customer }: { customer: Customer }) {
  const router = useRouter();
  const user = useAuthUser();

  return (
    <div className="flex justify-between items-center bg-secondary rounded-lg px-4 py-2 my-2">
      <div className="flex items-center gap-2">
        <div className="relative flex h-[50px] w-[50px] items-center justify-center rounded-full bg-buttons/20">
          <BuildingOffice2Icon className="h-6 w-6" />
        </div>
        <div>
          <strong>{customer.Name}</strong>
          {customer.Domain && <p className="text-sm opacity-70">{customer.Domain}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => router.push(`/dashboard/customers/edit-customer/${customer.CustomerId}`)}
          aria-label="Edit customer"
          className="w-full bg-secondary"
        >
          <PencilIcon className=" h-4 w-4 " />
        </Button>
        {user?.isAdmin && (
          <Button
            onClick={() => handleCustomerDelete(customer.CustomerId)}
            aria-label="Delete customer"
            className="w-full bg-secondary"
          >
            <TrashIcon className=" h-4 w-4 " />
          </Button>
        )}
        <Button
          onClick={() => router.push(`/dashboard/customers/customer/${customer.CustomerId}`)}
          aria-label="View customer"
          className="w-full bg-secondary"
        >
          <ChevronRightIcon className=" h-4 w-4 " />
        </Button>
      </div>
    </div>
  );
}
