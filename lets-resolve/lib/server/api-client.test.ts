jest.mock("@/utils/amplify-server-utils", () => ({
  getAccessToken: jest.fn(),
}));

import { apiGet, apiSend, ApiError } from "./api-client";
import { getAccessToken } from "@/utils/amplify-server-utils";

const mockGetAccessToken = getAccessToken as jest.Mock;

function mockFetchOnce(response: Partial<Response>) {
  (fetch as jest.Mock).mockResolvedValue(response);
}

beforeEach(() => {
  mockGetAccessToken.mockReset();
  global.fetch = jest.fn() as unknown as typeof fetch;
});

describe("apiGet", () => {
  it("attaches a bearer token when one is available", async () => {
    mockGetAccessToken.mockResolvedValue("token-123");
    mockFetchOnce({ ok: true, json: async () => ({ items: [] }) });

    await apiGet("/ticket/all");

    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toContain("/ticket/all");
    expect(options.headers).toEqual({ Authorization: "Bearer token-123" });
  });

  it("omits the Authorization header when no token is available", async () => {
    mockGetAccessToken.mockResolvedValue(undefined);
    mockFetchOnce({ ok: true, json: async () => ({}) });

    await apiGet("/ticket/all");

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.headers).toEqual({});
  });

  it("builds query params and skips undefined values", async () => {
    mockGetAccessToken.mockResolvedValue(undefined);
    mockFetchOnce({ ok: true, json: async () => ({}) });

    await apiGet("/ticket/all", { status: "open", priority: undefined });

    const [url] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toContain("status=open");
    expect(url).not.toContain("priority");
  });

  it("throws an ApiError carrying the server's status and message on failure", async () => {
    mockGetAccessToken.mockResolvedValue(undefined);
    mockFetchOnce({ ok: false, status: 404, json: async () => ({ error: "Not found" }) });

    let caught: unknown;
    try {
      await apiGet("/ticket/missing");
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(ApiError);
    expect((caught as ApiError).status).toBe(404);
    expect((caught as ApiError).message).toBe("Not found");
  });

  it("falls back to statusText when the error body isn't JSON", async () => {
    mockGetAccessToken.mockResolvedValue(undefined);
    mockFetchOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => {
        throw new Error("not json");
      },
    });

    await expect(apiGet("/ticket/all")).rejects.toMatchObject({
      status: 500,
      message: "Internal Server Error",
    });
  });
});

describe("apiSend", () => {
  it("sends a FormData body without a Content-Type header", async () => {
    mockGetAccessToken.mockResolvedValue("token-123");
    mockFetchOnce({ ok: true, status: 201, json: async () => ({}) });

    const formData = new FormData();
    formData.append("subject", "Hello");
    await apiSend("/ticket", "POST", formData);

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.method).toBe("POST");
    expect(options.body).toBe(formData);
    expect(options.headers["Content-Type"]).toBeUndefined();
  });

  it("sends a plain object body as JSON", async () => {
    mockGetAccessToken.mockResolvedValue(undefined);
    mockFetchOnce({ ok: true, status: 201, json: async () => ({}) });

    await apiSend("/customer", "POST", { name: "Acme" });

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.body).toBe(JSON.stringify({ name: "Acme" }));
  });

  it("returns undefined for a 204 response", async () => {
    mockGetAccessToken.mockResolvedValue(undefined);
    mockFetchOnce({ ok: true, status: 204 });

    await expect(apiSend("/ticket/1", "DELETE")).resolves.toBeUndefined();
  });
});
