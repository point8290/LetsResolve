import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { badRequest } from "./HttpError";

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export function parseLimit(
  raw: unknown,
  fallback = DEFAULT_PAGE_SIZE,
  max = MAX_PAGE_SIZE
): number {
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw badRequest("Query param 'limit' must be a positive number");
  }
  return Math.min(Math.trunc(value), max);
}

// The cursor is a base64url-encoded copy of DynamoDB's own
// LastEvaluatedKey, which is already in wire (AttributeValue) format, so
// round-tripping it back through decodeCursor is safe to feed straight into
// ExclusiveStartKey.
export function decodeCursor(
  raw: unknown
): Record<string, AttributeValue> | undefined {
  if (typeof raw !== "string" || raw.length === 0) return undefined;
  try {
    const json = Buffer.from(raw, "base64url").toString("utf-8");
    return JSON.parse(json);
  } catch {
    throw badRequest("Query param 'cursor' is invalid");
  }
}

export function encodeCursor(
  key: Record<string, AttributeValue> | undefined
): string | undefined {
  if (!key) return undefined;
  return Buffer.from(JSON.stringify(key)).toString("base64url");
}
