import { randomUUID } from "crypto";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { dyanmoClient } from "../config/awsConfig";
import Comment, { CommentType } from "../model/Comment";

const TABLE_NAME = "Comment";

/**
 * Builds a Comment-table entry. The sort key embeds `CreatedAt` so a Query
 * against a ticket's comments comes back in chronological order for free,
 * which also lets ticket updates drop system activity entries (status
 * changes, reassignment) into the same timeline as user comments.
 */
export function buildActivityEntry(
  ticketId: string,
  authorEmail: string,
  body: string,
  type: CommentType
): Comment {
  const createdAt = new Date().toISOString();
  const commentId = randomUUID();
  return {
    TicketId: ticketId,
    SortKey: `${createdAt}#${commentId}`,
    CommentId: commentId,
    Type: type,
    Body: body,
    AuthorEmail: authorEmail,
    CreatedAt: createdAt,
  };
}

export async function putComment(entry: Comment): Promise<void> {
  await dyanmoClient.send(
    new PutItemCommand({ TableName: TABLE_NAME, Item: marshall(entry) })
  );
}
