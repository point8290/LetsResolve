/**
 * Jest manual mock for the `aws-jwt-verify` package (auto-used by Jest for
 * every test since this file sits in `<rootDir>/__mocks__`). Verifying a
 * real Cognito access token means fetching that pool's JWKS over the
 * network, which tests shouldn't depend on. Instead the fake `verify`
 * base64-decodes the "token" straight back into the claims object a test
 * handed it, so `requireAuth`'s own logic (reading `cognito:groups`,
 * deriving `isAdmin`, wiring up `req.user`) still runs for real.
 */
export const CognitoJwtVerifier = {
  create: () => ({
    verify: async (token: string) => {
      try {
        return JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
      } catch {
        throw new Error("Invalid token");
      }
    },
  }),
};
