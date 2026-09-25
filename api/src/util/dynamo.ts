import { marshall } from "@aws-sdk/util-dynamodb";

/**
 * Builds the params for a partial-update DynamoDB UpdateItemCommand from a
 * plain object of changed fields, skipping any `undefined` values so callers
 * can spread optional fields in without accidentally clearing attributes.
 */
export function buildUpdateParams(
  tableName: string,
  key: Record<string, unknown>,
  updates: Record<string, unknown>
) {
  const entries = Object.entries(updates).filter(
    ([, value]) => value !== undefined
  );

  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};
  const setClauses = entries.map(([field, value], index) => {
    const nameToken = `#f${index}`;
    const valueToken = `:v${index}`;
    expressionAttributeNames[nameToken] = field;
    expressionAttributeValues[valueToken] = value;
    return `${nameToken} = ${valueToken}`;
  });

  return {
    TableName: tableName,
    Key: marshall(key),
    UpdateExpression: `SET ${setClauses.join(", ")}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: marshall(expressionAttributeValues, {
      removeUndefinedValues: true,
    }),
    ReturnValues: "ALL_NEW" as const,
  };
}
