"use client";

import { useFormState, useFormStatus } from "react-dom";
import { handleContactCreate } from "@/lib/contactAction";
import { Button } from "../button";
import { PlusIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
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
      className="flex flex-wrap items-end gap-2.5 rounded-xl border border-dashed border-separator p-3.5"
    >
      <div className="min-w-[140px] flex-1">
        <label className="field-label" htmlFor="contact-name">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          required
          minLength={2}
          placeholder="Jane Doe"
          className="field-input pl-3"
        />
      </div>
      <div className="min-w-[160px] flex-1">
        <label className="field-label" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="jane@acme.com"
          className="field-input pl-3"
        />
      </div>
      <div className="min-w-[120px] flex-1">
        <label className="field-label" htmlFor="contact-phone">
          Phone
        </label>
        <input
          id="contact-phone"
          name="phone"
          placeholder="Optional"
          className="field-input pl-3"
        />
      </div>
      <SubmitButton />
      {state && state !== "success" && (
        <div className="form-error w-full">
          <ExclamationCircleIcon className="h-4 w-4 shrink-0" />
          {state}
        </div>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button aria-disabled={pending} className="h-[42px] shrink-0">
      <PlusIcon className="h-4 w-4" />
      Add contact
    </Button>
  );
}
