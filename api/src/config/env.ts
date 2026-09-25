import { config } from "dotenv";

// Runs as soon as this module is first imported (e.g. from awsConfig.ts),
// so every module that reads process.env at import time sees real values
// regardless of which file happens to import which first.
config({ path: process.env.DOTENV_CONFIG_PATH ?? ".env.local" });

let validated = false;

const REQUIRED_IN_PRODUCTION = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_BUCKET_NAME",
  "COGNITO_USER_POOL_ID",
  "COGNITO_CLIENT_ID",
];

/**
 * Sanity-checks that the variables the app needs to talk to AWS and verify
 * Cognito tokens are present. Missing vars are a hard failure in production
 * (fail fast instead of returning 500s for every request) and a warning
 * everywhere else, so local dev and CI don't need real AWS credentials just
 * to boot the server.
 */
export function loadEnv(): void {
  if (validated) return;
  validated = true;

  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);
  if (missing.length === 0) return;

  const message = `Missing environment variables: ${missing.join(", ")}`;
  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  }
  if (process.env.NODE_ENV !== "test") {
    console.warn(`[config] ${message} (continuing since NODE_ENV=${process.env.NODE_ENV ?? "development"})`);
  }
}
