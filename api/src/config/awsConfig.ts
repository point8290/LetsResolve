import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { config } from "dotenv";
config({ path: ".env.local" });

const awsConfig = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};

export const s3Client = new S3Client(awsConfig);
export const dyanmoClient = new DynamoDBClient(awsConfig);
