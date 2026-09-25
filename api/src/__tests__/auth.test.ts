import { Request, Response } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { authHeader, adminAuthHeader } from "./helpers";

function mockReqRes(headers: Record<string, string> = {}) {
  const req = { headers } as unknown as Request;
  const res = {} as Response;
  const next = jest.fn();
  return { req, res, next };
}

function tokenFromHeader(header: string) {
  return header.replace(/^Bearer /, "");
}

describe("requireAuth", () => {
  it("rejects a request with no Authorization header", async () => {
    const { req, res, next } = mockReqRes();
    await requireAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
  });

  it("rejects a header that isn't a bearer token", async () => {
    const { req, res, next } = mockReqRes({ authorization: "Basic abc123" });
    await requireAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
  });

  it("rejects a token that fails verification", async () => {
    const { req, res, next } = mockReqRes({ authorization: "Bearer not-valid-json" });
    await requireAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
  });

  it("attaches an admin user when cognito:groups includes Admins", async () => {
    const header = adminAuthHeader({ sub: "abc-123", username: "admin@example.com" });
    const { req, res, next } = mockReqRes({ authorization: header });
    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual({
      sub: "abc-123",
      email: "admin@example.com",
      groups: ["Admins"],
      isAdmin: true,
    });
  });

  it("attaches a non-admin user when no groups are present", async () => {
    const header = authHeader({ sub: "xyz-789", username: "agent@example.com" });
    const { req, res, next } = mockReqRes({ authorization: header });
    await requireAuth(req, res, next);

    expect(req.user?.isAdmin).toBe(false);
    expect(req.user?.email).toBe("agent@example.com");
  });

  it("sanity-checks the fake-token helper actually round-trips through base64", () => {
    const token = tokenFromHeader(authHeader({ sub: "s" }));
    expect(JSON.parse(Buffer.from(token, "base64").toString("utf-8")).sub).toBe("s");
  });
});

describe("requireAdmin", () => {
  it("passes through for an admin user", () => {
    const { res, next } = mockReqRes();
    const req = { user: { isAdmin: true } } as unknown as Request;
    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it("rejects a non-admin user with 403", () => {
    const { res, next } = mockReqRes();
    const req = { user: { isAdmin: false } } as unknown as Request;
    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 403 }));
  });

  it("rejects a request with no user at all", () => {
    const { res, next } = mockReqRes();
    const req = {} as Request;
    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 403 }));
  });
});
