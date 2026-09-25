import { NextFunction, Request, Response } from "express";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { forbidden, unauthorized } from "../util/HttpError";

export interface AuthenticatedUser {
  sub: string;
  email: string;
  groups: string[];
  isAdmin: boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

let verifier: ReturnType<typeof CognitoJwtVerifier.create> | undefined;

function getVerifier() {
  if (!verifier) {
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    const clientId = process.env.COGNITO_CLIENT_ID;
    if (!userPoolId || !clientId) {
      throw new Error(
        "COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID must be set to verify requests"
      );
    }
    verifier = CognitoJwtVerifier.create({
      userPoolId,
      tokenUse: "access",
      clientId,
    });
  }
  return verifier;
}

/**
 * Verifies the Cognito access token on the `Authorization: Bearer <token>`
 * header and attaches the caller's identity to `req.user`. The front end
 * signs users up with their e-mail as the Cognito username, so
 * `payload.username` doubles as the caller's e-mail without a separate
 * ID-token round trip.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(unauthorized("Missing bearer token"));
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = await getVerifier().verify(token);
    const groups = Array.isArray(payload["cognito:groups"])
      ? (payload["cognito:groups"] as string[])
      : [];

    req.user = {
      sub: payload.sub,
      email: String(payload.username ?? payload.sub),
      groups,
      isAdmin: groups.includes("Admins"),
    };
    next();
  } catch {
    next(unauthorized("Invalid or expired token"));
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.isAdmin) {
    return next(forbidden("Admin privileges required"));
  }
  next();
}
