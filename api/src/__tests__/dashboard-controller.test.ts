import request from "supertest";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { app } from "../app";
import { authHeader } from "./helpers";

const ddbMock = mockClient(DynamoDBClient);

beforeEach(() => {
  ddbMock.reset();
});

describe("GET /dashboard/summary", () => {
  it("aggregates status counts and average resolution time", async () => {
    ddbMock
      .on(ScanCommand, { TableName: "Ticket" })
      .resolves({
        Items: [
          marshall({
            TicketId: "1",
            Status: "open",
            Priority: "high",
            CreatedAt: "2024-01-01T00:00:00.000Z",
            UpdatedAt: "2024-01-01T00:00:00.000Z",
          }),
          marshall({
            TicketId: "2",
            Status: "resolved",
            Priority: "medium",
            CreatedAt: "2024-01-01T00:00:00.000Z",
            UpdatedAt: "2024-01-02T00:00:00.000Z", // +24h
          }),
          marshall({
            TicketId: "3",
            Status: "resolved",
            Priority: "medium",
            CreatedAt: "2024-01-01T00:00:00.000Z",
            UpdatedAt: "2024-01-03T00:00:00.000Z", // +48h
          }),
        ],
      });
    ddbMock.on(ScanCommand, { TableName: "Customer" }).resolves({
      Items: [marshall({ CustomerId: "c1" }), marshall({ CustomerId: "c2" })],
    });

    const response = await request(app)
      .get("/dashboard/summary")
      .set("Authorization", authHeader());

    expect(response.status).toBe(200);
    expect(response.body.totalTickets).toBe(3);
    expect(response.body.totalCustomers).toBe(2);
    expect(response.body.statusCounts).toMatchObject({ open: 1, resolved: 2, closed: 0 });
    // (24h + 48h) / 2 resolved tickets = 36h average
    expect(response.body.avgResolutionHours).toBe(36);
    expect(response.body.recentTickets[0].TicketId).toBe("3");
  });

  it("returns a null average when nothing has been resolved yet", async () => {
    ddbMock.on(ScanCommand, { TableName: "Ticket" }).resolves({
      Items: [
        marshall({
          TicketId: "1",
          Status: "open",
          Priority: "low",
          CreatedAt: "2024-01-01T00:00:00.000Z",
          UpdatedAt: "2024-01-01T00:00:00.000Z",
        }),
      ],
    });
    ddbMock.on(ScanCommand, { TableName: "Customer" }).resolves({ Items: [] });

    const response = await request(app)
      .get("/dashboard/summary")
      .set("Authorization", authHeader());

    expect(response.body.avgResolutionHours).toBeNull();
  });
});
