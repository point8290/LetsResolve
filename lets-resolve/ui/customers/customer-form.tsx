"use client";

import { Button } from "@/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleCustomerCreate, handleCustomerUpdate } from "@/lib/customerAction";
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  GlobeAltIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import Customer from "@/lib/model/Customer";
import { useEffect, useRef } from "react";

export default function CustomerForm({
  isEditForm,
  customer,
}: {
  isEditForm: boolean;
  customer: Customer | undefined;
}) {
  const [errorMessage, dispatch] = useFormState(
    async (prevState: string | undefined, formData: FormData) => {
      if (isEditForm) {
        return await handleCustomerUpdate(
          prevState,
          formData,
          customer?.CustomerId || ""
        );
      } else {
        return await handleCustomerCreate(prevState, formData);
      }
    },
    undefined
  );
  const nameRef = useRef<HTMLInputElement | null>(null);
  const domainRef = useRef<HTMLInputElement | null>(null);
  const notesRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const updateFormData = (customer: Customer) => {
      if (nameRef.current) nameRef.current.value = customer.Name;
      if (domainRef.current) domainRef.current.value = customer.Domain || "";
      if (notesRef.current) notesRef.current.value = customer.Notes || "";
    };
    if (customer) {
      updateFormData(customer);
    }
  });

  return (
    <form
      action={dispatch}
      className="md:w-1/2 md:px-0 px-4 mt-8 mx-auto space-y-3"
    >
      <div className="flex-1 rounded-lg bg-ternary px-6 pb-4 pt-8">
        <h1 className={`mb-3 font-semibold text-center text-xl`}>
          {isEditForm ? "Edit Customer" : "Create a customer"}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="name"
            >
              Name
            </label>
            <div className="relative">
              <input
                className="peer block  w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                minLength={2}
                placeholder="Enter company name"
                required
                ref={nameRef}
              />
              <BuildingOffice2Icon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="domain"
            >
              Domain
            </label>
            <div className="relative">
              <input
                className="peer block w-full  rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                id="domain"
                type="text"
                name="domain"
                ref={domainRef}
                placeholder="acme.com"
              />
              <GlobeAltIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="notes"
            >
              Notes
            </label>
            <div className="relative">
              <textarea
                className="peer block w-full  rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                id="notes"
                name="notes"
                ref={notesRef}
                placeholder="Anything worth knowing about this account"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <SubmitCustomerButton isEditForm={isEditForm} />
        <div className="flex h-8 items-end space-x-1">
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function SubmitCustomerButton({ isEditForm }: { isEditForm: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      {isEditForm ? "Edit Customer" : "Create Customer"}
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
