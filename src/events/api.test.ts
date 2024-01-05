import { mockClient } from "aws-sdk-client-mock";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import assert from "node:assert";
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

describe("GET /events", () => {
  it("GET /events/:eventId - success", async () => {
    const mockEvent = generateFakeEvent();
    ddbMock.on(GetCommand).resolves({ Item: mockEvent });

    const res = await request(app).get(
      "/events/28899ee7-b841-4da6-81e2-b9054c091a79"
    );

    // Assertions
    assert.strictEqual(
      res.statusCode,
      200,
      "Response status code should be 200"
    );
    assert.deepStrictEqual(
      res.body,
      {
        eventId: mockEvent.eventId,
        eventName: mockEvent.eventName,
        eventType: mockEvent.eventType,
        eventDate: mockEvent.eventDate,
        location: mockEvent.location,
        host: mockEvent.host,
        ...(mockEvent.description && { description: mockEvent.description }),
        ...(mockEvent.capacity && { capacity: mockEvent.capacity }),
        ...(mockEvent.ticketPrice && { ticketPrice: mockEvent.ticketPrice }),
        ...(mockEvent.tags && { tags: mockEvent.tags }),
        ...(mockEvent.status && { status: mockEvent.status }),
      },
      "Response body should match the mock event structure and data"
    );
  });

  it("GET /events/:eventId - not found", async () => {
    ddbMock.on(GetCommand).resolves({
      Item: undefined,
    });

    const res = await request(app).get("/events/999");

    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.error, "Event not found");
  });
});

describe("GET ALL /events", () => {
  it("GET ALL /events - retrieve all events successfully", async () => {
    // Create a list of mock events
    const mockEvents = Array.from({ length: 5 }, () => generateFakeEvent());

    ddbMock.on(ScanCommand).resolves({ Items: mockEvents });

    const res = await request(app).get("/events");

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.length, mockEvents.length);
    mockEvents.forEach((event, index) => {
      const currentEvent = res.body[index];

      assert.deepStrictEqual(
        currentEvent,
        {
          eventId: event.eventId,
          eventName: event.eventName,
          eventType: event.eventType,
          eventDate: event.eventDate,
          location: event.location,
          host: event.host,
          ...(event.description && { description: event.description }),
          ...(event.capacity && { capacity: event.capacity }),
          ...(event.ticketPrice && { ticketPrice: event.ticketPrice }),
          ...(event.tags && { tags: event.tags }),
          ...(event.status && { status: event.status }),
        },
        "Response body should match the mock event structure and data"
      );

      assert.strictEqual(res.body[index].eventId, event.eventId);
      assert.strictEqual(res.body[index].eventName, event.eventName);
      assert.strictEqual(res.body[index].eventType, event.eventType);
      assert.strictEqual(res.body[index].eventDate, event.eventDate);
      assert.strictEqual(res.body[index].location, event.location);
      assert.strictEqual(res.body[index].host, event.host);
      if (event.description) {
        assert.strictEqual(res.body[index].description, event.description);
      }
      if (event.capacity) {
        assert.strictEqual(res.body[index].capacity, event.capacity);
      }
      if (event.ticketPrice) {
        assert.strictEqual(res.body[index].ticketPrice, event.ticketPrice);
      }
      if (event.tags) {
        assert.deepStrictEqual(res.body[index].tags, event.tags);
      }
      if (event.status) {
        assert.strictEqual(res.body[index].status, event.status);
      }
    });
  });

  it("GET ALL /events - handle empty list", async () => {
    ddbMock.on(ScanCommand).resolves({ Items: [] });

    const response = await request(app).get("/events");

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.length, 0);
  });
});

describe("POST /events", () => {
  it("POST /events - success", async () => {
    const mockEvent = generateFakeEvent();

    const response = await request(app).post("/events").send(mockEvent);

    assert.strictEqual(response.statusCode, 201);
    assert.notEqual(response.body.eventId, mockEvent.eventId);

    mockEvent.eventId = response.body.eventId;
    assert.deepStrictEqual(
      response.body,
      {
        eventId: mockEvent.eventId,
        eventName: mockEvent.eventName,
        eventType: mockEvent.eventType,
        eventDate: mockEvent.eventDate,
        location: mockEvent.location,
        host: mockEvent.host,
        ...(mockEvent.description && { description: mockEvent.description }),
        ...(mockEvent.capacity && { capacity: mockEvent.capacity }),
        ...(mockEvent.ticketPrice && { ticketPrice: mockEvent.ticketPrice }),
        ...(mockEvent.tags && { tags: mockEvent.tags }),
        ...(mockEvent.status && { status: mockEvent.status }),
      },
      "Response body should match the mock event structure and data"
    );
  });

  it("POST /events - fail", async () => {
    const mockEvent = generateFakeEvent();
    mockEvent.eventName = ""; // Remove a mandatory field

    const response = await request(app).post("/events").send(mockEvent);

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(
      response.body.error,
      "Missing required fields: eventName"
    );
  });

  it("POST /events - fail due to empty mandatory field", async () => {
    const mockEvent = generateFakeEvent();
    mockEvent.eventName = ""; // Set a mandatory field to empty

    const response = await request(app).post("/events").send(mockEvent);

    assert.strictEqual(response.statusCode, 400);
    assert.match(
      response.body.error,
      /.*eventName.*/,
      "Response text should contain an error message for null eventName"
    );
  });

  it("POST /events - success without optional fields", async () => {
    const mockEvent = generateFakeEvent();
    delete mockEvent.description; // Remove an optional field
    delete mockEvent.capacity; // Remove another optional field

    const response = await request(app).post("/events").send(mockEvent);

    assert.strictEqual(response.statusCode, 201);
    assert.ok(response.body.eventId);
  });

  it("POST /events - fail due to unexpected fields", async () => {
    const mockEvent = generateFakeEvent();

    //@ts-expect-error iting api behavior on unexpected field
    mockEvent.unexpectedField = "unexpected"; // Add an unexpected field

    const response = await request(app).post("/events").send(mockEvent);

    assert.strictEqual(response.statusCode, 400);
    assert.match(
      response.text,
      /Error: .*unexpectedField.*/,
      "Response text should contain an error message for unexpected field"
    );
  });

  it("POST /events - fail due to incorrect data types", async () => {
    const mockEvent = generateFakeEvent();

    //@ts-expect-error forcing a string on a number field to it api behavior
    mockEvent.capacity = "not a number"; // Invalid data type for capacity

    const response = await request(app).post("/events").send(mockEvent);

    assert.strictEqual(response.statusCode, 400);
    assert.strictEqual(
      response.body.error,
      "capacity must be a number",
      "Response text should contain an error message for incorrect data type"
    );
  });
});
