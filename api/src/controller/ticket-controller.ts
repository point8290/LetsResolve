import {
  GetItemCommand,
  ScanCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { client } from "../dbConfig/dynamo";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Request, Response } from "express";
import Ticket from "../model/Ticket";
import { validateEmail } from "../util/Validator";
const TABLE_NAME = "Ticket";

export const getTicket = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (id) {
    const params = {
      TableName: TABLE_NAME,
      Key: marshall({
        TicketId: id,
      }),
    };
    const { Item } = await client.send(new GetItemCommand(params));
    if (Item) console.log(unmarshall(Item));
    res.send("success");
  } else {
    const params = {
      TableName: TABLE_NAME,
    };
    const { Items } = await client.send(new ScanCommand(params));
    console.log(Items);
    res.send("success");
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const item: Ticket = {
      TicketId: req.body.TicketId.toString(),
      Subject: req.body.Subject,
      Description: req.body.Description ? req.body.Description : "",
      AssignedTo: validateEmail(req.body.AssignedTo),
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      Attachments: undefined,
    };

    const params = {
      TableName: TABLE_NAME,
      Item: marshall(item),
    };
    const data = await client.send(new PutItemCommand(params));
    console.log(data);
    res.send("success");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
export const updateTicket = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { body } = req;
  const objKeys = Object.keys(body);

  const params = {
    TableName: TABLE_NAME,
    Key: marshall({
      TicketId: id,
    }),
    UpdateExpression: `SET ${objKeys
      .map((_, index) => `#key${index} = :value${index}`)
      .join(", ")}`,
    ExpressionAttributeNames: objKeys.reduce(
      (acc, key, index) => ({
        ...acc,
        [`#key${index}`]: key,
      }),
      {}
    ),
    ExpressionAttributeValues: marshall(
      objKeys.reduce(
        (acc, key, index) => ({
          ...acc,
          [`:value${index}`]: body[key],
        }),
        {}
      )
    ),
  };
  const { Attributes } = await client.send(new UpdateItemCommand(params));
  console.log(Attributes);
  res.send("success");
};
export const deleteTicket = async (req: Request, res: Response) => {
  const id = req.params.id;
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({
      TicketId: id,
    }),
  };
  const { Attributes } = await client.send(new DeleteItemCommand(params));
  console.log(Attributes);
  res.send("success");
};
