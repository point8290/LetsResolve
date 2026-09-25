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
import Article from "../model/Article";
import { CreateArticleInput, UpdateArticleInput } from "../validation/article";

const TABLE_NAME = "Article";

function extractAttachmentUrls(req: Request): string[] {
  if (!req.files) return [];
  return (req.files as Express.MulterS3.File[]).map((file) => file.location);
}

export const getArticle = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { Item } = await dyanmoClient.send(
    new GetItemCommand({ TableName: TABLE_NAME, Key: marshall({ ArticleId: id }) })
  );
  if (!Item) throw notFound(`No article found with id ${id}`);
  res.status(200).json(unmarshall(Item));
});

export const getArticles = asyncHandler(async (req: Request, res: Response) => {
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

export const createArticle = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateArticleInput;
  const now = new Date().toISOString();

  const item: Article = {
    ArticleId: randomUUID(),
    Title: body.title,
    Description: body.description ?? "",
    Author: body.author,
    Attachments: extractAttachmentUrls(req),
    CreatedAt: now,
    UpdatedAt: now,
  };

  await dyanmoClient.send(
    new PutItemCommand({ TableName: TABLE_NAME, Item: marshall(item) })
  );
  res.status(201).json(item);
});

export const updateArticle = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body as UpdateArticleInput;
  const attachmentUrls = extractAttachmentUrls(req);

  const { Item } = await dyanmoClient.send(
    new GetItemCommand({ TableName: TABLE_NAME, Key: marshall({ ArticleId: id }) })
  );
  if (!Item) throw notFound(`No article found with id ${id}`);
  const existing = unmarshall(Item) as Article;

  const updates: Partial<Article> = {
    ...(body.title !== undefined && { Title: body.title }),
    ...(body.description !== undefined && { Description: body.description }),
    ...(body.author !== undefined && { Author: body.author }),
    ...(attachmentUrls.length > 0 && { Attachments: attachmentUrls }),
    UpdatedAt: new Date().toISOString(),
  };

  const { Attributes } = await dyanmoClient.send(
    new UpdateItemCommand(buildUpdateParams(TABLE_NAME, { ArticleId: id }, updates))
  );

  res.status(200).json(Attributes ? unmarshall(Attributes) : { ...existing, ...updates });
});

export const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  await dyanmoClient.send(
    new DeleteItemCommand({ TableName: TABLE_NAME, Key: marshall({ ArticleId: id }) })
  );
  res.status(200).json({ message: "Article successfully deleted" });
});
