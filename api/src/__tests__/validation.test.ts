import { createTicketSchema } from "../validation/ticket";
import { createArticleSchema } from "../validation/article";
import { createCustomerSchema } from "../validation/customer";
import { createContactSchema } from "../validation/contact";
import { createCommentSchema } from "../validation/comment";

describe("createTicketSchema", () => {
  it("applies defaults for status, priority and description", () => {
    const result = createTicketSchema.parse({
      subject: "Login broken",
      assignedTo: "agent@example.com",
    });
    expect(result).toMatchObject({
      status: "open",
      priority: "medium",
      description: "",
    });
  });

  it("rejects a subject that is too short", () => {
    expect(() =>
      createTicketSchema.parse({ subject: "Hi", assignedTo: "agent@example.com" })
    ).toThrow();
  });

  it("rejects an invalid assignee email", () => {
    expect(() =>
      createTicketSchema.parse({ subject: "Login broken", assignedTo: "not-an-email" })
    ).toThrow();
  });

  it("rejects a status outside the known set", () => {
    expect(() =>
      createTicketSchema.parse({
        subject: "Login broken",
        assignedTo: "agent@example.com",
        status: "archived",
      })
    ).toThrow();
  });
});

describe("createArticleSchema", () => {
  it("accepts a valid article", () => {
    const result = createArticleSchema.parse({
      title: "How to reset your password",
      author: "writer@example.com",
    });
    expect(result.description).toBe("");
  });

  it("rejects a missing title", () => {
    expect(() => createArticleSchema.parse({ author: "writer@example.com" })).toThrow();
  });
});

describe("createCustomerSchema", () => {
  it("accepts a valid customer", () => {
    const result = createCustomerSchema.parse({ name: "Acme Inc" });
    expect(result.name).toBe("Acme Inc");
  });

  it("rejects a one-character name", () => {
    expect(() => createCustomerSchema.parse({ name: "A" })).toThrow();
  });
});

describe("createContactSchema", () => {
  it("accepts a valid contact", () => {
    const result = createContactSchema.parse({
      name: "Jane Doe",
      email: "jane@acme.com",
    });
    expect(result.email).toBe("jane@acme.com");
  });

  it("rejects an invalid email", () => {
    expect(() =>
      createContactSchema.parse({ name: "Jane Doe", email: "not-an-email" })
    ).toThrow();
  });
});

describe("createCommentSchema", () => {
  it("rejects an empty body", () => {
    expect(() => createCommentSchema.parse({ body: "" })).toThrow();
  });

  it("accepts a non-empty body", () => {
    expect(createCommentSchema.parse({ body: "Looking into this now." }).body).toBe(
      "Looking into this now."
    );
  });
});
