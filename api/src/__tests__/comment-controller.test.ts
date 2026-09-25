import request from "supertest";
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { app } from "../app";
import { authHeader } from "./helpers";

const ddbMock = mockClient(DynamoDBClient);

beforeEach(() => {
  ddbMock.reset();
});

describe("POST /ticket/:ticketId/comments", () => {
  it("creates a comment authored by the caller", async () => {
    ddbMock.on(PutItemCommand).resolves({});

    const response = await request(app)
      .post("/ticket/1/comments")
      .set("Authorization", authHeader({ username: "agent@example.com" }))
      .send({ body: "Looking into this now." });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      TicketId: "1",
      Type: "comment",
      Body: "Looking into this now.",
      AuthorEmail: "agent@example.com",
    });
  });

  it("rejects an empty comment body", async () => {
    const response = await request(app)
      .post("/ticket/1/comments")
      .set("Authorization", authHeader())
      .send({ body: "" });

    expect(response.status).toBe(400);
  });
});

describe("GET /ticket/:ticketId/comments", () => {
  it("returns comments in chronological order", async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        marshall({ TicketId: "1", SortKey: "2024-01-01T00:00:00.000Z#a", CommentId: "a" }),
        marshall({ TicketId: "1", SortKey: "2024-01-02T00:00:00.000Z#b", CommentId: "b" }),
      ],
    });

    const response = await request(app)
      .get("/ticket/1/comments")
      .set("Authorization", authHeader());

    expect(response.status).toBe(200);
    expect(response.body.items.map((c: { CommentId: string }) => c.CommentId)).toEqual([
      "a",
      "b",
    ]);
  });
});
