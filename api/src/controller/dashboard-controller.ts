import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Request, Response } from "express";
import { dyanmoClient } from "../config/awsConfig";
import { asyncHandler } from "../middleware/asyncHandler";
import Ticket, { TICKET_PRIORITIES, TICKET_STATUSES, TicketPriority, TicketStatus } from "../model/Ticket";

/**
 * Summarizes ticket + customer data for the dashboard home page. This scans
 * both tables in full, which is fine at the data volumes a portfolio/demo
 * deployment sees; at production scale these counts should be maintained
 * incrementally (e.g. DynamoDB Streams into an aggregates table) instead of
 * recomputed from a full scan on every request.
 */
export const getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
  const [ticketResult, customerResult] = await Promise.all([
    dyanmoClient.send(new ScanCommand({ TableName: "Ticket" })),
    dyanmoClient.send(new ScanCommand({ TableName: "Customer" })),
  ]);

  const tickets = (ticketResult.Items ?? []).map((item) => unmarshall(item) as Ticket);

  const statusCounts = TICKET_STATUSES.reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as Record<TicketStatus, number>
  );
  const priorityCounts = TICKET_PRIORITIES.reduce(
    (acc, priority) => ({ ...acc, [priority]: 0 }),
    {} as Record<TicketPriority, number>
  );

  const resolutionDurationsMs: number[] = [];
  for (const ticket of tickets) {
    statusCounts[ticket.Status] = (statusCounts[ticket.Status] ?? 0) + 1;
    priorityCounts[ticket.Priority] = (priorityCounts[ticket.Priority] ?? 0) + 1;
    if (ticket.Status === "resolved" || ticket.Status === "closed") {
      const durationMs = new Date(ticket.UpdatedAt).getTime() - new Date(ticket.CreatedAt).getTime();
      if (Number.isFinite(durationMs) && durationMs >= 0) {
        resolutionDurationsMs.push(durationMs);
      }
    }
  }

  const avgResolutionHours =
    resolutionDurationsMs.length > 0
      ? resolutionDurationsMs.reduce((sum, ms) => sum + ms, 0) /
        resolutionDurationsMs.length /
        (1000 * 60 * 60)
      : null;

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.UpdatedAt).getTime() - new Date(a.UpdatedAt).getTime())
    .slice(0, 10);

  res.status(200).json({
    totalTickets: tickets.length,
    totalCustomers: customerResult.Items?.length ?? 0,
    statusCounts,
    priorityCounts,
    avgResolutionHours,
    recentTickets,
  });
});
