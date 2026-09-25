import { unmarshall } from "@aws-sdk/util-dynamodb";
import { buildUpdateParams } from "../util/dynamo";

describe("buildUpdateParams", () => {
  it("builds a SET expression covering only the defined fields", () => {
    const params = buildUpdateParams(
      "Ticket",
      { TicketId: "abc" },
      { Subject: "New subject", Description: undefined, Status: "closed" }
    );

    expect(params.TableName).toBe("Ticket");
    expect(unmarshall(params.Key)).toEqual({ TicketId: "abc" });
    expect(params.UpdateExpression).toBe("SET #f0 = :v0, #f1 = :v1");
    expect(params.ExpressionAttributeNames).toEqual({
      "#f0": "Subject",
      "#f1": "Status",
    });
    expect(unmarshall(params.ExpressionAttributeValues)).toEqual({
      ":v0": "New subject",
      ":v1": "closed",
    });
    expect(params.ReturnValues).toBe("ALL_NEW");
  });

  it("produces an empty SET clause when every update is undefined", () => {
    const params = buildUpdateParams("Ticket", { TicketId: "abc" }, {});
    expect(params.UpdateExpression).toBe("SET ");
  });
});
