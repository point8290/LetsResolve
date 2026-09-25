import { TicketPriority, TicketStatus } from "./Ticket";
import Ticket from "./Ticket";

export default interface DashboardSummary {
  totalTickets: number;
  totalCustomers: number;
  statusCounts: Record<TicketStatus, number>;
  priorityCounts: Record<TicketPriority, number>;
  avgResolutionHours: number | null;
  recentTickets: Ticket[];
}
