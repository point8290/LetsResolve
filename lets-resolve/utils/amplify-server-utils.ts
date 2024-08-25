import { NextServer, createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import { config } from "@/config/aws-config";
export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

export async function authenticatedUser(context: NextServer.Context) {
  return await runWithAmplifyServerContext({
    nextServerContext: context,
    operation: async (contextSpec) => {
      try {
        console.log("obtaning session tokens");
        const session = await fetchAuthSession(contextSpec);
        if (!session.tokens) {
          console.log("no session tokens");

          return;
        }
        console.log(" session tokens obtained");

        const user = {
          ...(await getCurrentUser(contextSpec)),
          isAdmin: false,
        };
        const groups = session.tokens.accessToken.payload["cognito:groups"];
        // @ts-ignore
        user.isAdmin = Boolean(groups && groups.includes("Admins"));

        return user;
      } catch (error) {
        console.log(error);
      }
    },
  });
}
