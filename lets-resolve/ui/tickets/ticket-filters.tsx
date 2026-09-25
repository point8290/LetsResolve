import Link from "next/link";
import clsx from "clsx";
import { TICKET_STATUSES, TICKET_STATUS_LABELS, TicketStatus } from "@/lib/model/Ticket";

export default function TicketFilters({ activeStatus }: { activeStatus?: string }) {
  const options: { value?: TicketStatus; label: string }[] = [
    { value: undefined, label: "All" },
    ...TICKET_STATUSES.map((status) => ({ value: status, label: TICKET_STATUS_LABELS[status] })),
  ];

  return (
    <div className="my-3 flex flex-wrap gap-2">
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
              "rounded-full bg-secondary px-3 py-1 text-sm font-medium hover:opacity-60",
              { "bg-selected": isActive }
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
