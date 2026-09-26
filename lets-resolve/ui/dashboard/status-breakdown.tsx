import {
  TICKET_STATUSES,
  TICKET_STATUS_LABELS,
  TicketStatus,
} from "@/lib/model/Ticket";

// The "closed" bucket deliberately sits outside the three validated
// categorical hues (see globals.css): it reads as inactive/neutral rather
// than competing for identity against the active statuses.
const BAR_COLOR: Record<TicketStatus, string> = {
  open: "var(--chart-series-1)",
  in_progress: "var(--chart-series-2)",
  resolved: "var(--chart-series-3)",
  closed: "var(--chart-neutral)",
};

export default function StatusBreakdown({
  counts,
  total,
}: {
  counts: Record<TicketStatus, number>;
  total: number;
}) {
  return (
    <div className="card p-5">
      <h2 className="panel-heading">Tickets by status</h2>
      <ul className="mt-4 space-y-4">
        {TICKET_STATUSES.map((status) => {
          const count = counts[status] ?? 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <li key={status} title={`${TICKET_STATUS_LABELS[status]}: ${count} (${percentage}%)`}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-typography">
                  <span
                    aria-hidden
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: BAR_COLOR[status] }}
                  />
                  {TICKET_STATUS_LABELS[status]}
                </span>
                <span className="tabular-nums text-muted">{count}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-shadow">
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{ width: `${percentage}%`, backgroundColor: BAR_COLOR[status] }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
