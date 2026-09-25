import { randomUUID } from "crypto";
import {
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Request, Response } from "express";
import { dyanmoClient } from "../config/awsConfig";
import { asyncHandler } from "../middleware/asyncHandler";
import { buildUpdateParams } from "../util/dynamo";
import { notFound } from "../util/HttpError";
import Contact from "../model/Contact";
import { CreateContactInput, UpdateContactInput } from "../validation/contact";

const TABLE_NAME = "Contact";

export const getContact = asyncHandler(async (req: Request, res: Response) => {
  const { customerId, contactId } = req.params;
  const { Item } = await dyanmoClient.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ CustomerId: customerId, ContactId: contactId }),
    })
  );
  if (!Item) throw notFound(`No contact found with id ${contactId}`);
  res.status(200).json(unmarshall(Item));
});

// Contacts per customer are a small, bounded set, so a Query (no pagination
// needed) sorted by creation date in memory is simpler than a second GSI.
export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const { Items } = await dyanmoClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "CustomerId = :customerId",
      ExpressionAttributeValues: marshall({ ":customerId": customerId }),
    })
  );
  const contacts = (Items ?? [])
    .map((item) => unmarshall(item) as Contact)
    .sort((a, b) => a.CreatedAt.localeCompare(b.CreatedAt));
  res.status(200).json({ items: contacts });
});

export const createContact = asyncHandler(async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const body = req.body as CreateContactInput;
  const now = new Date().toISOString();

  const item: Contact = {
    CustomerId: customerId,
    ContactId: randomUUID(),
    Name: body.name,
    Email: body.email,
    Phone: body.phone,
    CreatedAt: now,
    UpdatedAt: now,
  };

  await dyanmoClient.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(item, { removeUndefinedValues: true }),
    })
  );
  res.status(201).json(item);
});

export const updateContact = asyncHandler(async (req: Request, res: Response) => {
  const { customerId, contactId } = req.params;
  const body = req.body as UpdateContactInput;

  const { Item } = await dyanmoClient.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ CustomerId: customerId, ContactId: contactId }),
    })
  );
  if (!Item) throw notFound(`No contact found with id ${contactId}`);
  const existing = unmarshall(Item) as Contact;

  const updates: Partial<Contact> = {
    ...(body.name !== undefined && { Name: body.name }),
    ...(body.email !== undefined && { Email: body.email }),
    ...(body.phone !== undefined && { Phone: body.phone }),
    UpdatedAt: new Date().toISOString(),
  };

  const { Attributes } = await dyanmoClient.send(
    new UpdateItemCommand(
      buildUpdateParams(TABLE_NAME, { CustomerId: customerId, ContactId: contactId }, updates)
    )
  );

  res.status(200).json(Attributes ? unmarshall(Attributes) : { ...existing, ...updates });
});

export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const { customerId, contactId } = req.params;
  await dyanmoClient.send(
    new DeleteItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ CustomerId: customerId, ContactId: contactId }),
    })
  );
  res.status(200).json({ message: "Contact successfully deleted" });
});
