"use client";

import { useFormState, useFormStatus } from "react-dom";
import { handleContactCreate } from "@/lib/contactAction";
import { Button } from "../button";
import { PlusIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useRef } from "react";

export default function AddContactForm({ customerId }: { customerId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, dispatch] = useFormState(
    async (prevState: string | undefined, formData: FormData) => {
      const result = await handleContactCreate(prevState, formData, customerId);
      if (result === "success") {
        formRef.current?.reset();
      }
      return result;
    },
    undefined
  );

  return (
    <form
      ref={formRef}
      action={dispatch}
      className="flex flex-wrap items-end gap-2 mb-3 bg-ternary rounded-lg p-3"
    >
      <div className="flex-1 min-w-[140px]">
        <label className="mb-1 block text-xs font-medium" htmlFor="contact-name">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          required
          minLength={2}
          placeholder="Jane Doe"
          className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm text-gray-900 placeholder:text-gray-500"
        />
      </div>
      <div className="flex-1 min-w-[160px]">
        <label className="mb-1 block text-xs font-medium" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="jane@acme.com"
          className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm text-gray-900 placeholder:text-gray-500"
        />
      </div>
      <div className="flex-1 min-w-[120px]">
        <label className="mb-1 block text-xs font-medium" htmlFor="contact-phone">
          Phone
        </label>
        <input
          id="contact-phone"
          name="phone"
          placeholder="Optional"
          className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm text-gray-900 placeholder:text-gray-500"
        />
      </div>
      <SubmitButton />
      {state && state !== "success" && (
        <div className="flex w-full items-center gap-1 text-sm text-red-500">
          <ExclamationCircleIcon className="h-4 w-4" />
          {state}
        </div>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button aria-disabled={pending} className="h-[38px]">
      <PlusIcon className="h-4 w-4" />
      <span className="ml-1">Add contact</span>
    </Button>
  );
}
