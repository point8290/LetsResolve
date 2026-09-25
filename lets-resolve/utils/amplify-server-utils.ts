import { NextServer, createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import { config } from "@/config/aws-config";
export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

export async function authenticatedUser(context: NextServer.Context) {
  return await runWithAmplifyServerContext({
    nextServerContext: context,
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        if (!session.tokens) {
          return;
        }

        const user = {
          ...(await getCurrentUser(contextSpec)),
          isAdmin: false,
        };
        const groups = session.tokens.accessToken.payload["cognito:groups"];
        // @ts-ignore
        user.isAdmin = Boolean(groups && groups.includes("Admins"));

        return user;
      } catch (error) {
        console.error(error);
      }
    },
  });
}

/**
 * Retrieves the caller's Cognito access token for use in Server Actions and
 * Server Components. Unlike middleware, those don't get a NextRequest /
 * NextResponse pair to hand Amplify — but they can read the session cookies
 * Amplify already set on sign-in via `next/headers`.
 */
export async function getAccessToken(): Promise<string | undefined> {
  return runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens?.accessToken?.toString();
      } catch (error) {
        console.error(error);
        return undefined;
      }
    },
  });
}
