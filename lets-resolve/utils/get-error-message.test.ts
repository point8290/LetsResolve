import { getErrorMessage } from "./get-error-message";

describe("getErrorMessage", () => {
  it("returns the message from an Error instance", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("returns the message property from an error-like object", () => {
    expect(getErrorMessage({ message: "custom failure" })).toBe("custom failure");
  });

  it("returns a plain string as-is", () => {
    expect(getErrorMessage("plain string")).toBe("plain string");
  });

  it("falls back to a generic message for unknown shapes", () => {
    expect(getErrorMessage(42)).toBe("An error occurred");
    expect(getErrorMessage(null)).toBe("An error occurred");
    expect(getErrorMessage(undefined)).toBe("An error occurred");
  });
});
