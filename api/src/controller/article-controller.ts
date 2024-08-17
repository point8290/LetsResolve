import {
  GetItemCommand,
  ScanCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { dyanmoClient } from "../config/awsConfig";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Request, Response } from "express";
import Article from "../model/Article";
import { validateEmail } from "../util/Validator";
import { config } from "dotenv";
config({ path: ".env.local" });

const TABLE_NAME = "Article";

const generateArticleId = () => {
  return Math.trunc(Math.random() * 1000000);
};

export const getArticle = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);
  console.log("getArticle called");
  try {
    if (id) {
      const params = {
        TableName: TABLE_NAME,
        Key: marshall({
          ArticleId: id,
        }),
      };
      const { Item } = await dyanmoClient.send(new GetItemCommand(params));

      if (Item) {
        res.send(unmarshall(Item));
      } else {
        res.send({ message: "No record found" });
      }
    } else {
      res.send({ message: "Please provide valid article id" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};
export const getArticles = async (req: Request, res: Response) => {
  console.log("getArticles called");

  try {
    const params = {
      TableName: TABLE_NAME,
    };
    const { Items } = await dyanmoClient.send(new ScanCommand(params));
    const data = Items?.map((item) => {
      return unmarshall(item);
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};
export const createArticle = async (req: Request, res: Response) => {
  console.log("createArticle called");

  try {
    let urls: string[] = [];
    if (req.files) {
      const attachments = req.files as Express.MulterS3.File[];
      if (attachments) {
        urls = attachments?.map((file) => {
          return file.location;
        });
      }
    }
    console.log(urls, req.body);

    const item: Article = {
      ArticleId: generateArticleId().toString(),
      Title: req.body.title,
      Description: req.body.description ? req.body.description : "",
      Author: validateEmail(req.body.author),
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      Attachments: urls != null ? urls : [],
    };

    const params = {
      TableName: TABLE_NAME,
      Item: marshall(item),
    };
    await dyanmoClient.send(new PutItemCommand(params));
    res.send({ message: "Article successfully created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};
export const updateArticle = async (req: Request, res: Response) => {
  console.log("updateArticle called");

  const id = req.params.id;
  const { body } = req;
  let urls: string[] = [];
  if (req.files) {
    const attachments = req.files as Express.MulterS3.File[];
    if (attachments) {
      urls = attachments?.map((file) => {
        return file.location;
      });
    }
    body["Attachments"] = urls;
  }
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
  const { Attributes } = await dyanmoClient.send(new UpdateItemCommand(params));
  console.log(Attributes);
  res.send({ message: "Article successfully updated" });
};
export const deleteArticle = async (req: Request, res: Response) => {
  console.log("deleteArticle called");

  try {
    const id = req.params.id;
    const params = {
      TableName: TABLE_NAME,
      Key: marshall({
        ArticleId: id,
      }),
    };
    await dyanmoClient.send(new DeleteItemCommand(params));
    res.status(200).send({ message: "Article successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};
