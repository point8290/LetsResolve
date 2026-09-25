/** Builds a fake bearer token the `aws-jwt-verify` manual mock will decode
 * straight back into these claims — see `__mocks__/aws-jwt-verify.ts`. */
export function authHeader(claims: Record<string, unknown> = {}): string {
  const token = Buffer.from(
    JSON.stringify({
      sub: "test-user-sub",
      username: "agent@example.com",
      "cognito:groups": [],
      ...claims,
    })
  ).toString("base64");
  return `Bearer ${token}`;
}

export function adminAuthHeader(claims: Record<string, unknown> = {}): string {
  return authHeader({ "cognito:groups": ["Admins"], ...claims });
}
