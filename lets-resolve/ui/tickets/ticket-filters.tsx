import Link from "next/link";
import clsx from "clsx";
import { TICKET_STATUSES, TICKET_STATUS_LABELS, TicketStatus } from "@/lib/model/Ticket";

export default function TicketFilters({ activeStatus }: { activeStatus?: string }) {
  const options: { value?: TicketStatus; label: string }[] = [
    { value: undefined, label: "All" },
    ...TICKET_STATUSES.map((status) => ({ value: status, label: TICKET_STATUS_LABELS[status] })),
  ];

  return (
    <div className="my-5 flex flex-wrap gap-1.5 border-b border-separator pb-4">
      {options.map((option) => {
        const isActive = (activeStatus ?? undefined) === option.value;
        const href = option.value
          ? `/dashboard/tickets?status=${option.value}`
          : "/dashboard/tickets";
        return (
          <Link
            key={option.label}
            href={href}
            className={clsx(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-selected text-accent"
                : "text-muted hover:bg-shadow hover:text-typography"
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
