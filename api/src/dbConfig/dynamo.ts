import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { config } from "dotenv";
config();

export const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
});
