import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Request, Response } from "express";
import { dyanmoClient } from "../config/awsConfig";
import { asyncHandler } from "../middleware/asyncHandler";
import { decodeCursor, encodeCursor, parseLimit } from "../util/pagination";
import { buildActivityEntry, putComment } from "../util/activity";
import { CreateCommentInput } from "../validation/comment";

const TABLE_NAME = "Comment";

export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const limit = parseLimit(req.query.limit, 50, 200);
  const exclusiveStartKey = decodeCursor(req.query.cursor);

  const { Items, LastEvaluatedKey } = await dyanmoClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "TicketId = :ticketId",
      ExpressionAttributeValues: marshall({ ":ticketId": ticketId }),
      ScanIndexForward: true,
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
    })
  );

  res.status(200).json({
    items: (Items ?? []).map((item) => unmarshall(item)),
    nextCursor: encodeCursor(LastEvaluatedKey),
  });
});

export const createComment = asyncHandler(async (req: Request, res: Response) => {
  const { ticketId } = req.params;
  const body = req.body as CreateCommentInput;
  const authorEmail = req.user?.email ?? "unknown";

  const entry = buildActivityEntry(ticketId, authorEmail, body.body, "comment");
  await putComment(entry);

  res.status(201).json(entry);
});
