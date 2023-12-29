// ./src/lambda1.test.ts
import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import assert from "node:assert";
import test, { beforeEach } from "node:test";
import app from "./api";
import request from "supertest";
import type { Event } from "../types";
import { faker } from "@faker-js/faker";

const ddbMock = mockClient(DynamoDBDocumentClient);

const generateFakeEvent = (): Event => {
  return {
    eventId: faker.string.uuid(),
    eventName: faker.commerce.productName(),
    eventType: "concert", // You can randomize this based on your needs
    eventDate: faker.date.future().toISOString(),
    location: faker.location.city(),
    host: faker.person.fullName(),
    description: faker.lorem.sentence(),
    capacity: faker.number.int({ min: 100, max: 1000 }),
    ticketPrice: faker.number.float(),
    tags: [faker.lorem.word(), faker.lorem.word(), faker.lorem.word()],
    status: "scheduled", // Or randomize based on your status types
  };
};

beforeEach(() => {
  ddbMock.reset();
});

test("GET /events/:eventId - success", async () => {
  const mockEvent = generateFakeEvent();
  ddbMock.on(GetCommand).resolves({ Item: mockEvent });

  const res = await request(app).get(
    "/events/28899ee7-b841-4da6-81e2-b9054c091a79",
  );

  // Assertions
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.eventId, mockEvent.eventId);
  assert.strictEqual(res.body.eventName, mockEvent.eventName);
  assert.strictEqual(res.body.eventType, mockEvent.eventType);
  assert.strictEqual(res.body.eventDate, mockEvent.eventDate);
  assert.strictEqual(res.body.location, mockEvent.location);
  assert.strictEqual(res.body.host, mockEvent.host);
  if (mockEvent.description) {
    assert.strictEqual(res.body.description, mockEvent.description);
  }
  if (mockEvent.capacity) {
    assert.strictEqual(res.body.capacity, mockEvent.capacity);
  }
  if (mockEvent.ticketPrice) {
    assert.strictEqual(res.body.ticketPrice, mockEvent.ticketPrice);
  }
  if (mockEvent.tags) {
    assert.deepStrictEqual(res.body.tags, mockEvent.tags);
  }
  if (mockEvent.status) {
    assert.strictEqual(res.body.status, mockEvent.status);
  }
});

test("GET /events/:eventId - not found", async () => {
  ddbMock.on(GetCommand).resolves({
    Item: undefined,
  });

  const res = await request(app).get("/events/999");

  assert.strictEqual(res.statusCode, 404);
  assert.strictEqual(res.body.error, "Event not found");
});
