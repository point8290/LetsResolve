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
} from "@heroicons/react/24/outline";
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
    <form action={dispatch} className="mx-auto mt-8 max-w-xl px-4 md:px-0">
      <div className="card p-6">
        <h1 className="font-display text-xl font-semibold text-typography">
          {isEditForm ? "Edit customer" : "Create a customer"}
        </h1>

        <div className="mt-5 w-full space-y-4">
          <div>
            <label className="field-label" htmlFor="name">
              Name
            </label>
            <div className="relative">
              <input
                className="peer field-input"
                id="name"
                type="text"
                name="name"
                minLength={2}
                placeholder="Enter company name"
                required
                ref={nameRef}
              />
              <BuildingOffice2Icon className="field-icon" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="domain">
              Domain
            </label>
            <div className="relative">
              <input
                className="peer field-input"
                id="domain"
                type="text"
                name="domain"
                ref={domainRef}
                placeholder="acme.com"
              />
              <GlobeAltIcon className="field-icon" />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="notes">
              Notes
            </label>
            <div className="relative">
              <textarea
                className="peer field-textarea pl-10"
                id="notes"
                name="notes"
                ref={notesRef}
                rows={4}
                placeholder="Anything worth knowing about this account"
              />
              <DocumentTextIcon className="field-icon top-6" />
            </div>
          </div>
        </div>

        <SubmitCustomerButton isEditForm={isEditForm} />
        <div
          className="mt-3 flex min-h-[20px] items-center"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <div className="form-error">
              <ExclamationCircleIcon className="h-5 w-5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

function SubmitCustomerButton({ isEditForm }: { isEditForm: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-6 w-full" aria-disabled={pending}>
      {isEditForm ? "Save changes" : "Create customer"}
      <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}
