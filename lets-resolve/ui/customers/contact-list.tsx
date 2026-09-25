"use client";

import Contact from "@/lib/model/Contact";
import { Button } from "../button";
import { TrashIcon, UserIcon } from "@heroicons/react/24/solid";
import { handleContactDelete } from "@/lib/contactAction";
import useAuthUser from "@/app/hooks/use-auth-user";
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
          className="flex items-center justify-between rounded-lg bg-secondary px-4 py-2"
        >
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            <div>
              <strong>{contact.Name}</strong>
              <p className="text-sm opacity-70">
                {contact.Email}
                {contact.Phone ? ` · ${contact.Phone}` : ""}
              </p>
            </div>
          </div>
          {user?.isAdmin && (
            <Button
              onClick={() => handleContactDelete(customerId, contact.ContactId)}
              aria-label={`Delete contact ${contact.Name}`}
              className="bg-secondary"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
