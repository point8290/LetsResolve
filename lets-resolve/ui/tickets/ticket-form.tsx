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
} from "@heroicons/react/24/outline";
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
    <form action={dispatch} className="mx-auto mt-8 max-w-xl px-4 md:px-0">
      <div className="card p-6">
        <h1 className="font-display text-xl font-semibold text-typography">
          {isEditForm ? "Edit ticket" : "Create a ticket"}
        </h1>

        <div className="mt-5 w-full space-y-4">
          <div>
            <label className="field-label" htmlFor="subject">
              Subject
            </label>
            <div className="relative">
              <input
                className="peer field-input"
                id="subject"
                type="text"
                name="subject"
                minLength={4}
                placeholder="Enter subject"
                required
                ref={subjectRef}
              />
              <TicketIcon className="field-icon" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={ticket?.Status ?? "open"}
                className="field-select"
              >
                {TICKET_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {TICKET_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                defaultValue={ticket?.Priority ?? "medium"}
                className="field-select"
              >
                {TICKET_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {TICKET_PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="email">
              Assigned to
            </label>
            <div className="relative">
              <input
                className="peer field-input"
                id="email"
                type="email"
                name="assignedTo"
                ref={assignedToRef}
                placeholder="Enter email address"
                required
              />
              <AtSymbolIcon className="field-icon" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label" htmlFor="customerId">
                Customer
              </label>
              <select
                id="customerId"
                name="customerId"
                defaultValue={ticket?.CustomerId ?? ""}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="field-select"
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
              <label className="field-label" htmlFor="contactId">
                Contact
              </label>
              <select
                id="contactId"
                name="contactId"
                defaultValue={ticket?.ContactId ?? ""}
                disabled={!selectedCustomerId}
                className="field-select disabled:cursor-not-allowed disabled:opacity-60"
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

          <div>
            <label className="field-label" htmlFor="description">
              Description
            </label>
            <div className="relative">
              <textarea
                className="peer field-textarea pl-10"
                id="description"
                name="description"
                ref={descriptionRef}
                placeholder="Enter description"
                rows={4}
                required
              />
              <DocumentTextIcon className="field-icon top-6" />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="attachment">
              Attachments
            </label>
            <div className="relative">
              <input
                className="peer field-input file:mr-3 file:rounded-md file:border-0 file:bg-shadow file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-typography"
                id="attachments"
                type="file"
                name="attachments"
                multiple={true}
              />
              <FolderIcon className="field-icon" />
            </div>
          </div>
        </div>

        <SubmitTicketButton isEditForm={isEditForm} />
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

function SubmitTicketButton({ isEditForm }: { isEditForm: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-6 w-full" aria-disabled={pending}>
      {isEditForm ? "Save changes" : "Create ticket"}
      <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}
