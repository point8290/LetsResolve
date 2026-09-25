import request from "supertest";
import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBClient,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { app } from "../app";
import { adminAuthHeader, authHeader } from "./helpers";

const ddbMock = mockClient(DynamoDBClient);

beforeEach(() => {
  ddbMock.reset();
});

describe("POST /ticket", () => {
  it("creates a ticket with default status/priority and returns 201", async () => {
    ddbMock.on(PutItemCommand).resolves({});

    const response = await request(app)
      .post("/ticket")
      .set("Authorization", authHeader())
      .field("subject", "Cannot log in")
      .field("assignedTo", "agent@example.com");

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      Subject: "Cannot log in",
      Status: "open",
      Priority: "medium",
      AssignedTo: "agent@example.com",
    });
    expect(response.body.TicketId).toEqual(expect.any(String));
  });

  it("rejects an invalid payload with 400", async () => {
    const response = await request(app)
      .post("/ticket")
      .set("Authorization", authHeader())
      .field("subject", "Hi")
      .field("assignedTo", "not-an-email");

    expect(response.status).toBe(400);
    expect(ddbMock.commandCalls(PutItemCommand)).toHaveLength(0);
  });

  it("rejects an unauthenticated request with 401", async () => {
    const response = await request(app)
      .post("/ticket")
      .field("subject", "Cannot log in")
      .field("assignedTo", "agent@example.com");

    expect(response.status).toBe(401);
  });
});

describe("GET /ticket/all", () => {
  it("returns a paginated list", async () => {
    ddbMock.on(ScanCommand).resolves({
      Items: [marshall({ TicketId: "1", Subject: "A", Status: "open" })],
      LastEvaluatedKey: marshall({ TicketId: "1" }),
    });

    const response = await request(app).get("/ticket/all").set("Authorization", authHeader());

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].TicketId).toBe("1");
    expect(typeof response.body.nextCursor).toBe("string");
  });
});

describe("GET /ticket/:id", () => {
  it("returns 404 when the ticket does not exist", async () => {
    ddbMock.on(GetItemCommand).resolves({});

    const response = await request(app)
      .get("/ticket/missing")
      .set("Authorization", authHeader());

    expect(response.status).toBe(404);
  });

  it("returns the ticket when it exists", async () => {
    ddbMock.on(GetItemCommand).resolves({
      Item: marshall({ TicketId: "1", Subject: "A", Status: "open" }),
    });

    const response = await request(app).get("/ticket/1").set("Authorization", authHeader());

    expect(response.status).toBe(200);
    expect(response.body.TicketId).toBe("1");
  });
});

describe("PUT /ticket/:id", () => {
  const existingTicket = marshall({
    TicketId: "1",
    Subject: "Cannot log in",
    Description: "",
    Status: "open",
    Priority: "medium",
    AssignedTo: "agent@example.com",
    Attachments: [],
    CreatedAt: "2024-01-01T00:00:00.000Z",
    UpdatedAt: "2024-01-01T00:00:00.000Z",
  });

  it("logs an activity comment when status changes", async () => {
    ddbMock.on(GetItemCommand).resolves({ Item: existingTicket });
    ddbMock.on(UpdateItemCommand).resolves({
      Attributes: marshall({ TicketId: "1", Status: "resolved" }),
    });
    ddbMock.on(PutItemCommand).resolves({});

    const response = await request(app)
      .put("/ticket/1")
      .set("Authorization", authHeader())
      .field("status", "resolved");

    expect(response.status).toBe(200);
    const activityCalls = ddbMock.commandCalls(PutItemCommand);
    expect(activityCalls).toHaveLength(1);
    const activityItem = activityCalls[0].args[0].input.Item;
    expect(activityItem?.Type?.S).toBe("status_change");
  });

  it("does not write an activity comment when nothing tracked changes", async () => {
    ddbMock.on(GetItemCommand).resolves({ Item: existingTicket });
    ddbMock.on(UpdateItemCommand).resolves({ Attributes: existingTicket });

    const response = await request(app)
      .put("/ticket/1")
      .set("Authorization", authHeader())
      .field("description", "Same subject, more detail");

    expect(response.status).toBe(200);
    expect(ddbMock.commandCalls(PutItemCommand)).toHaveLength(0);
  });

  it("returns 404 when updating a ticket that does not exist", async () => {
    ddbMock.on(GetItemCommand).resolves({});

    const response = await request(app)
      .put("/ticket/missing")
      .set("Authorization", authHeader())
      .field("status", "resolved");

    expect(response.status).toBe(404);
  });
});

describe("DELETE /ticket/:id", () => {
  it("rejects a non-admin with 403", async () => {
    const response = await request(app)
      .delete("/ticket/1")
      .set("Authorization", authHeader());

    expect(response.status).toBe(403);
    expect(ddbMock.commandCalls(DeleteItemCommand)).toHaveLength(0);
  });

  it("allows an admin to delete", async () => {
    ddbMock.on(DeleteItemCommand).resolves({});

    const response = await request(app)
      .delete("/ticket/1")
      .set("Authorization", adminAuthHeader());

    expect(response.status).toBe(200);
  });
});
