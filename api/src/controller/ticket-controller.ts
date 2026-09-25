import { randomUUID } from "crypto";
import {
  GetItemCommand,
  ScanCommand,
  ScanCommandInput,
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
import { decodeCursor, encodeCursor, parseLimit } from "../util/pagination";
import { buildActivityEntry, putComment } from "../util/activity";
import Ticket, { TicketPriority, TicketStatus } from "../model/Ticket";
import { CreateTicketInput, UpdateTicketInput } from "../validation/ticket";

const TABLE_NAME = "Ticket";

function extractAttachmentUrls(req: Request): string[] {
  if (!req.files) return [];
  return (req.files as Express.MulterS3.File[]).map((file) => file.location);
}

export const getTicket = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { Item } = await dyanmoClient.send(
    new GetItemCommand({ TableName: TABLE_NAME, Key: marshall({ TicketId: id }) })
  );
  if (!Item) throw notFound(`No ticket found with id ${id}`);
  res.status(200).json(unmarshall(Item));
});

export const getTickets = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseLimit(req.query.limit);
  const exclusiveStartKey = decodeCursor(req.query.cursor);

  const filterClauses: string[] = [];
  const attributeNames: Record<string, string> = {};
  const attributeValues: Record<string, unknown> = {};

  if (typeof req.query.status === "string") {
    filterClauses.push("#status = :status");
    attributeNames["#status"] = "Status";
    attributeValues[":status"] = req.query.status;
  }
  if (typeof req.query.priority === "string") {
    filterClauses.push("#priority = :priority");
    attributeNames["#priority"] = "Priority";
    attributeValues[":priority"] = req.query.priority;
  }
  if (typeof req.query.customerId === "string") {
    filterClauses.push("CustomerId = :customerId");
    attributeValues[":customerId"] = req.query.customerId;
  }

  const params: ScanCommandInput = {
    TableName: TABLE_NAME,
    Limit: limit,
    ExclusiveStartKey: exclusiveStartKey,
  };
  if (filterClauses.length > 0) {
    params.FilterExpression = filterClauses.join(" AND ");
    params.ExpressionAttributeValues = marshall(attributeValues);
    params.ExpressionAttributeNames = attributeNames;
  }

  const { Items, LastEvaluatedKey } = await dyanmoClient.send(new ScanCommand(params));
  res.status(200).json({
    items: (Items ?? []).map((item) => unmarshall(item)),
    nextCursor: encodeCursor(LastEvaluatedKey),
  });
});

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateTicketInput;
  const now = new Date().toISOString();

  const item: Ticket = {
    TicketId: randomUUID(),
    Subject: body.subject,
    Description: body.description ?? "",
    Status: body.status ?? "open",
    Priority: body.priority ?? "medium",
    AssignedTo: body.assignedTo,
    CustomerId: body.customerId,
    ContactId: body.contactId,
    Attachments: extractAttachmentUrls(req),
    CreatedAt: now,
    UpdatedAt: now,
    CreatedBy: req.user?.email,
  };

  await dyanmoClient.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(item, { removeUndefinedValues: true }),
    })
  );
  res.status(201).json(item);
});

export const updateTicket = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body as UpdateTicketInput;
  const attachmentUrls = extractAttachmentUrls(req);

  const { Item } = await dyanmoClient.send(
    new GetItemCommand({ TableName: TABLE_NAME, Key: marshall({ TicketId: id }) })
  );
  if (!Item) throw notFound(`No ticket found with id ${id}`);
  const existing = unmarshall(Item) as Ticket;

  const updates: Partial<Ticket> = {
    ...(body.subject !== undefined && { Subject: body.subject }),
    ...(body.description !== undefined && { Description: body.description }),
    ...(body.status !== undefined && { Status: body.status }),
    ...(body.priority !== undefined && { Priority: body.priority }),
    ...(body.assignedTo !== undefined && { AssignedTo: body.assignedTo }),
    ...(body.customerId !== undefined && { CustomerId: body.customerId }),
    ...(body.contactId !== undefined && { ContactId: body.contactId }),
    ...(attachmentUrls.length > 0 && { Attachments: attachmentUrls }),
    UpdatedAt: new Date().toISOString(),
  };

  const { Attributes } = await dyanmoClient.send(
    new UpdateItemCommand(buildUpdateParams(TABLE_NAME, { TicketId: id }, updates))
  );

  await recordTicketActivity(id, req.user?.email ?? existing.AssignedTo, existing, updates);

  res.status(200).json(Attributes ? unmarshall(Attributes) : { ...existing, ...updates });
});

async function recordTicketActivity(
  ticketId: string,
  actorEmail: string,
  existing: Ticket,
  updates: Partial<Ticket>
) {
  const entries = [];
  if (updates.Status && updates.Status !== existing.Status) {
    entries.push(
      buildActivityEntry(
        ticketId,
        actorEmail,
        `Status changed from ${formatLabel(existing.Status)} to ${formatLabel(updates.Status as TicketStatus)}`,
        "status_change"
      )
    );
  }
  if (updates.Priority && updates.Priority !== existing.Priority) {
    entries.push(
      buildActivityEntry(
        ticketId,
        actorEmail,
        `Priority changed from ${formatLabel(existing.Priority)} to ${formatLabel(updates.Priority as TicketPriority)}`,
        "priority_change"
      )
    );
  }
  if (updates.AssignedTo && updates.AssignedTo !== existing.AssignedTo) {
    entries.push(
      buildActivityEntry(
        ticketId,
        actorEmail,
        `Reassigned from ${existing.AssignedTo} to ${updates.AssignedTo}`,
        "assignment"
      )
    );
  }
  await Promise.all(entries.map((entry) => putComment(entry)));
}

function formatLabel(value: string): string {
  return value.replace(/_/g, " ");
}

export const deleteTicket = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  await dyanmoClient.send(
    new DeleteItemCommand({ TableName: TABLE_NAME, Key: marshall({ TicketId: id }) })
  );
  res.status(200).json({ message: "Ticket successfully deleted" });
});
