"use client";

import { Button } from "@/ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { handleTicketCreate, handleTicketUpdate } from "@/lib/ticketAction";
import { fetchContacts } from "@/lib/contactAction";
import {
  ArrowRightIcon,
  TicketIcon,
  AtSymbolIcon,
  FolderIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import Ticket, { TICKET_PRIORITIES, TICKET_PRIORITY_LABELS, TICKET_STATUSES, TICKET_STATUS_LABELS } from "@/lib/model/Ticket";
import Customer from "@/lib/model/Customer";
import Contact from "@/lib/model/Contact";
import { useEffect, useRef, useState } from "react";

export default function TicketForm({
  isEditForm,
  ticket,
  customers,
}: {
  isEditForm: boolean;
  ticket: Ticket | undefined;
  customers: Customer[];
}) {
  const [errorMessage, dispatch] = useFormState(
    async (prevState: string | undefined, formData: FormData) => {
      if (isEditForm) {
        return await handleTicketUpdate(
          prevState,
          formData,
          ticket?.TicketId || ""
        );
      } else {
        return await handleTicketCreate(prevState, formData);
      }
    },
    undefined
  );
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const assignedToRef = useRef<HTMLInputElement | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(ticket?.CustomerId ?? "");
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const updateFormData = (ticket: Ticket) => {
      if (subjectRef.current) subjectRef.current.value = ticket.Subject;
      if (descriptionRef.current)
        descriptionRef.current.value = ticket.Description || "";
      if (assignedToRef.current)
        assignedToRef.current.value = ticket.AssignedTo;
    };
    if (ticket) {
      updateFormData(ticket);
    }
  });

  useEffect(() => {
    if (!selectedCustomerId) {
      setContacts([]);
      return;
    }
    let cancelled = false;
    fetchContacts(selectedCustomerId).then((page) => {
      if (!cancelled) setContacts(page.items);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedCustomerId]);

  return (
    <form
      action={dispatch}
      className="md:w-1/2 md:px-0 px-4 mt-8 mx-auto space-y-3"
    >
      <div className="flex-1 rounded-lg bg-ternary px-6 pb-4 pt-8">
        <h1 className={`mb-3 font-semibold text-center text-xl`}>
          {isEditForm ? "Edit Ticket" : "Create a ticket"}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="subject"
            >
              Subject
            </label>
            <div className="relative">
              <input
                className="peer block  w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                id="subject"
                type="text"
                name="subject"
                minLength={4}
                placeholder="Enter subject"
                required
                ref={subjectRef}
              />
              <TicketIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-3 mt-5 block text-xs font-medium" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={ticket?.Status ?? "open"}
                className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm text-gray-900"
              >
                {TICKET_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {TICKET_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-3 mt-5 block text-xs font-medium" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                defaultValue={ticket?.Priority ?? "medium"}
                className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm text-gray-900"
              >
                {TICKET_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {TICKET_PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="email"
            >
              Assigned to
            </label>
            <div className="relative">
              <input
                className="peer block w-full  rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                id="email"
                type="email"
                name="assignedTo"
                ref={assignedToRef}
                placeholder="Enter email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-3 mt-5 block text-xs font-medium" htmlFor="customerId">
                Customer
              </label>
              <select
                id="customerId"
                name="customerId"
                defaultValue={ticket?.CustomerId ?? ""}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm text-gray-900"
              >
                <option value="">None</option>
                {customers.map((customer) => (
                  <option key={customer.CustomerId} value={customer.CustomerId}>
                    {customer.Name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-3 mt-5 block text-xs font-medium" htmlFor="contactId">
                Contact
              </label>
              <select
                id="contactId"
                name="contactId"
                defaultValue={ticket?.ContactId ?? ""}
                disabled={!selectedCustomerId}
                className="block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm text-gray-900 disabled:opacity-50"
              >
                <option value="">None</option>
                {contacts.map((contact) => (
                  <option key={contact.ContactId} value={contact.ContactId}>
                    {contact.Name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="description"
            >
              Description
            </label>
            <div className="relative">
              <textarea
                className="peer block w-full  rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                id="description"
                name="description"
                ref={descriptionRef}
                placeholder="Enter description"
                required
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="attachment"
            >
              Attachments
            </label>
            <div className="relative">
              <input
                className="peer block w-full  rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 text-gray-900 placeholder:text-gray-500"
                id="attachments"
                type="file"
                name="attachments"
                multiple={true}
              />
              <FolderIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <SubmitTicketButton isEditForm={isEditForm} />
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

function SubmitTicketButton({ isEditForm }: { isEditForm: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      {isEditForm ? "Edit Ticket" : "Create Ticket"}
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
