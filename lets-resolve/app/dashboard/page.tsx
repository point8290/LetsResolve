import { fetchDashboardSummary } from "@/lib/dashboardAction";
import StatTile from "@/ui/dashboard/stat-tile";
import StatusBreakdown from "@/ui/dashboard/status-breakdown";
import RecentTickets from "@/ui/dashboard/recent-tickets";

export default async function Dashboard() {
  const summary = await fetchDashboardSummary();
  const openTickets = summary.statusCounts.open + summary.statusCounts.in_progress;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 py-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-typography">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted">
          Where things stand across tickets and customers right now.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile label="Open tickets" value={String(openTickets)} />
        <StatTile label="Resolved" value={String(summary.statusCounts.resolved)} />
        <StatTile label="Customers" value={String(summary.totalCustomers)} />
        <StatTile
          label="Avg. resolution"
          value={
            summary.avgResolutionHours != null
              ? `${summary.avgResolutionHours.toFixed(1)}h`
              : "—"
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatusBreakdown counts={summary.statusCounts} total={summary.totalTickets} />
        <RecentTickets tickets={summary.recentTickets} />
      </div>
    </main>
  );
}
