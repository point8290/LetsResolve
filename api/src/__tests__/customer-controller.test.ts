import request from "supertest";
import { mockClient } from "aws-sdk-client-mock";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { app } from "../app";
import { authHeader } from "./helpers";

const ddbMock = mockClient(DynamoDBClient);

beforeEach(() => {
  ddbMock.reset();
});

describe("POST /customer", () => {
  it("creates a customer", async () => {
    ddbMock.on(PutItemCommand).resolves({});

    const response = await request(app)
      .post("/customer")
      .set("Authorization", authHeader())
      .send({ name: "Acme Inc", domain: "acme.com" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ Name: "Acme Inc", Domain: "acme.com" });
    expect(response.body.CustomerId).toEqual(expect.any(String));
  });

  it("rejects a name that is too short", async () => {
    const response = await request(app)
      .post("/customer")
      .set("Authorization", authHeader())
      .send({ name: "A" });

    expect(response.status).toBe(400);
  });
});

describe("GET /customer/all", () => {
  it("lists customers", async () => {
    ddbMock.on(ScanCommand).resolves({
      Items: [marshall({ CustomerId: "c1", Name: "Acme Inc" })],
    });

    const response = await request(app).get("/customer/all").set("Authorization", authHeader());

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
  });
});

describe("customer contacts", () => {
  it("creates a contact nested under a customer", async () => {
    ddbMock.on(PutItemCommand).resolves({});

    const response = await request(app)
      .post("/customer/c1/contacts")
      .set("Authorization", authHeader())
      .send({ name: "Jane Doe", email: "jane@acme.com" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      CustomerId: "c1",
      Name: "Jane Doe",
      Email: "jane@acme.com",
    });
  });

  it("lists a customer's contacts sorted by creation date", async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: [
        marshall({
          CustomerId: "c1",
          ContactId: "second",
          Name: "B",
          Email: "b@acme.com",
          CreatedAt: "2024-02-01T00:00:00.000Z",
        }),
        marshall({
          CustomerId: "c1",
          ContactId: "first",
          Name: "A",
          Email: "a@acme.com",
          CreatedAt: "2024-01-01T00:00:00.000Z",
        }),
      ],
    });

    const response = await request(app)
      .get("/customer/c1/contacts")
      .set("Authorization", authHeader());

    expect(response.status).toBe(200);
    expect(response.body.items.map((c: { ContactId: string }) => c.ContactId)).toEqual([
      "first",
      "second",
    ]);
  });

  it("returns 404 for a contact that does not exist", async () => {
    ddbMock.on(GetItemCommand).resolves({});

    const response = await request(app)
      .get("/customer/c1/contacts/missing")
      .set("Authorization", authHeader());

    expect(response.status).toBe(404);
  });
});
