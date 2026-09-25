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
import Customer from "../model/Customer";
import { CreateCustomerInput, UpdateCustomerInput } from "../validation/customer";

const TABLE_NAME = "Customer";

export const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { Item } = await dyanmoClient.send(
    new GetItemCommand({ TableName: TABLE_NAME, Key: marshall({ CustomerId: id }) })
  );
  if (!Item) throw notFound(`No customer found with id ${id}`);
  res.status(200).json(unmarshall(Item));
});

export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseLimit(req.query.limit);
  const exclusiveStartKey = decodeCursor(req.query.cursor);

  const params: ScanCommandInput = {
    TableName: TABLE_NAME,
    Limit: limit,
    ExclusiveStartKey: exclusiveStartKey,
  };

  const { Items, LastEvaluatedKey } = await dyanmoClient.send(new ScanCommand(params));
  res.status(200).json({
    items: (Items ?? []).map((item) => unmarshall(item)),
    nextCursor: encodeCursor(LastEvaluatedKey),
  });
});

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateCustomerInput;
  const now = new Date().toISOString();

  const item: Customer = {
    CustomerId: randomUUID(),
    Name: body.name,
    Domain: body.domain,
    Notes: body.notes,
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

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body as UpdateCustomerInput;

  const { Item } = await dyanmoClient.send(
    new GetItemCommand({ TableName: TABLE_NAME, Key: marshall({ CustomerId: id }) })
  );
  if (!Item) throw notFound(`No customer found with id ${id}`);
  const existing = unmarshall(Item) as Customer;

  const updates: Partial<Customer> = {
    ...(body.name !== undefined && { Name: body.name }),
    ...(body.domain !== undefined && { Domain: body.domain }),
    ...(body.notes !== undefined && { Notes: body.notes }),
    UpdatedAt: new Date().toISOString(),
  };

  const { Attributes } = await dyanmoClient.send(
    new UpdateItemCommand(buildUpdateParams(TABLE_NAME, { CustomerId: id }, updates))
  );

  res.status(200).json(Attributes ? unmarshall(Attributes) : { ...existing, ...updates });
});

export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  await dyanmoClient.send(
    new DeleteItemCommand({ TableName: TABLE_NAME, Key: marshall({ CustomerId: id }) })
  );
  res.status(200).json({ message: "Customer successfully deleted" });
});
