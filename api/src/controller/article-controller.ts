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
import Article from "../model/Article";
import { validateEmail } from "../util/Validator";
const TABLE_NAME = "Article";

export const getArticle = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (id) {
    const params = {
      TableName: TABLE_NAME,
      Key: marshall({
        ArticleId: id,
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

export const createArticle = async (req: Request, res: Response) => {
  try {
    const item: Article = {
      ArticleId: req.body.ArticleId.toString(),
      Title: req.body.Title,
      Description: req.body.Description ? req.body.Description : "",
      Author: validateEmail(req.body.Author),
      Attachments: undefined,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
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
export const updateArticle = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { body } = req;
  const objKeys = Object.keys(body);

  const params = {
    TableName: TABLE_NAME,
    Key: marshall({
      ArticleId: id,
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
export const deleteArticle = async (req: Request, res: Response) => {
  const id = req.params.id;
  const params = {
    TableName: TABLE_NAME,
    Key: marshall({
      ArticleId: id,
    }),
  };
  const { Attributes } = await client.send(new DeleteItemCommand(params));
  console.log(Attributes);
  res.send("success");
};
