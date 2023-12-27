// ./src/lambda1.test.ts
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import assert from "node:assert";
import test, { beforeEach } from "node:test";
import app from "./api";
import request from "supertest";

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

test("GET /events/:eventId - success", async () => {
  ddbMock.on(GetCommand).resolves({
    Item: {
      eventId: "28899ee7-b841-4da6-81e2-b9054c091a79",
      name: "Event One",
    },
  });

  const res = await request(app).get(
    "/events/28899ee7-b841-4da6-81e2-b9054c091a79"
  );

  // Assertions
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.eventId, "28899ee7-b841-4da6-81e2-b9054c091a79");
  assert.strictEqual(res.body.name, "Event One");
});

test("GET /events/:eventId - not found", async () => {
  ddbMock.on(GetCommand).resolves({
    Item: undefined,
  });

  const res = await request(app).get("/events/999");

  assert.strictEqual(res.statusCode, 404);
});
