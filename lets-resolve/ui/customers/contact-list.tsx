"use client";

import Contact from "@/lib/model/Contact";
import { Button } from "../button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { handleContactDelete } from "@/lib/contactAction";
import useAuthUser from "@/app/hooks/use-auth-user";
import Avatar from "../avatar";
import EmptyText from "../emptyText";

export default function ContactList({
  customerId,
  contacts,
}: {
  customerId: string;
  contacts: Contact[];
}) {
  const user = useAuthUser();

  if (!contacts || contacts.length === 0) {
    return <EmptyText text="No contacts yet" />;
  }

  return (
    <div className="space-y-2">
      {contacts.map((contact) => (
        <div
          key={contact.ContactId}
          className="group flex items-center justify-between rounded-xl border border-separator px-3.5 py-2.5 transition-colors hover:bg-shadow"
        >
          <div className="flex items-center gap-3">
            <Avatar label={contact.Name} size="sm" />
            <div>
              <p className="text-sm font-medium text-typography">{contact.Name}</p>
              <p className="text-xs text-muted">
                {contact.Email}
                {contact.Phone ? ` · ${contact.Phone}` : ""}
              </p>
            </div>
          </div>
          {user?.isAdmin && (
            <Button
              variant="ghost"
              onClick={() => handleContactDelete(customerId, contact.ContactId)}
              aria-label={`Delete contact ${contact.Name}`}
              size="icon-sm"
              className="transition-opacity hover:text-danger sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
