import { decodeCursor, encodeCursor, parseLimit } from "../util/pagination";
import { HttpError } from "../util/HttpError";

describe("parseLimit", () => {
  it("returns the fallback when no limit is given", () => {
    expect(parseLimit(undefined)).toBe(20);
  });

  it("uses a custom fallback and max when given", () => {
    expect(parseLimit(undefined, 50, 200)).toBe(50);
  });

  it("clamps to the maximum page size", () => {
    expect(parseLimit("500")).toBe(100);
  });

  it("truncates a fractional limit", () => {
    expect(parseLimit("10.9")).toBe(10);
  });

  it("rejects non-numeric input", () => {
    expect(() => parseLimit("abc")).toThrow(HttpError);
  });

  it("rejects zero or negative input", () => {
    expect(() => parseLimit("0")).toThrow(HttpError);
    expect(() => parseLimit("-5")).toThrow(HttpError);
  });
});

describe("cursor round-trip", () => {
  it("encodes and decodes a DynamoDB LastEvaluatedKey", () => {
    const key = { TicketId: { S: "abc-123" } };
    const cursor = encodeCursor(key);
    expect(typeof cursor).toBe("string");
    expect(decodeCursor(cursor)).toEqual(key);
  });

  it("returns undefined for an empty key", () => {
    expect(encodeCursor(undefined)).toBeUndefined();
    expect(decodeCursor(undefined)).toBeUndefined();
  });

  it("rejects a cursor that isn't valid encoded JSON", () => {
    expect(() => decodeCursor("not-a-real-cursor!!")).toThrow(HttpError);
  });
});
