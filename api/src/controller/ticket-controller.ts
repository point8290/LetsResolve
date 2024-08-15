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

const generateTicketId = () => {
  return Math.trunc(Math.random() * 1000000);
};

export const getTicket = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);
  console.log("getTicket called");
  try {
    if (id) {
      const params = {
        TableName: TABLE_NAME,
        Key: marshall({
          TicketId: id,
        }),
      };
      const { Item } = await client.send(new GetItemCommand(params));

      if (Item) {
        res.send(unmarshall(Item));
      } else {
        res.send({ message: "No record found" });
      }
    } else {
      res.send({ message: "Please provide valid ticket id" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};
export const getTickets = async (req: Request, res: Response) => {
  console.log("getTickets called");

  try {
    const params = {
      TableName: TABLE_NAME,
    };
    const { Items } = await client.send(new ScanCommand(params));
    const data = Items?.map((item) => {
      return unmarshall(item);
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};
export const createTicket = async (req: Request, res: Response) => {
  console.log("createTicket called");

  try {
    const item: Ticket = {
      TicketId: generateTicketId().toString(),
      Subject: req.body.Subject,
      Description: req.body.Description ? req.body.Description : "",
      AssignedTo: validateEmail(req.body.AssignedTo),
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      Attachments: ["test", "test"],
    };

    const params = {
      TableName: TABLE_NAME,
      Item: marshall(item),
    };
    const data = await client.send(new PutItemCommand(params));
    console.log(data);
    res.send({ message: "Ticket successfully created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};
export const updateTicket = async (req: Request, res: Response) => {
  console.log("updateTicket called");

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
  res.send({ message: "Ticket successfully updated" });
};
export const deleteTicket = async (req: Request, res: Response) => {
  console.log("deleteTicket called");

  try {
    const id = req.params.id;
    const params = {
      TableName: TABLE_NAME,
      Key: marshall({
        TicketId: id,
      }),
    };
    await client.send(new DeleteItemCommand(params));
    res.status(200).send({ message: "Ticket successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};
