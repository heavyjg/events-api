import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import type { Event } from "../types";
import { validateFieldTypes, validateKeys } from "./validations";

const validKeys = [
  "eventId",
  "eventName",
  "eventType",
  "eventDate",
  "location",
  "host",
  "description",
  "capacity",
  "ticketPrice",
  "tags",
  "status",
];

describe("validateKeys", () => {
  it("should return null for valid keys", () => {
    const event: Partial<Event> = {
      eventName: "Test Event",
      eventType: "Conference",
      // add other valid keys and values
    };
    const result = validateKeys(event, validKeys);
    assert.equal(result, null);
  });

  it("should return an error message for an invalid key", () => {
    const event: Partial<Event> = {
      eventName: "Test Event",
      //@ts-expect-error forcing invalid field
      invalidKey: "Invalid", // This key is invalid
    };
    const result = validateKeys(event, validKeys);
    assert.strictEqual(
      result,
      "Error: Invalid field 'invalidKey' in request body",
    );
  });
});

describe("validateFieldTypes", () => {
  it("should return null for valid field types", () => {
    const event: Partial<Event> = {
      eventName: "Test Event",
      eventType: "Conference",
      eventDate: "2022-01-01",
      location: "Test Location",
      host: "Test Host",
      // add other fields with valid types
    };
    const result = validateFieldTypes(event as Event);
    assert.equal(result, null);
  });

  it("should return an error message for an invalid field type", () => {
    const event: Partial<Event> = {
      //@ts-expect-error force number to raise error
      eventName: 123, // eventName should be a string
      eventType: "Conference",
      // add other fields
    };
    const result = validateFieldTypes(event as Event);
    assert.strictEqual(result, "eventName must be a string");
  });

  // Add additional tests for each field type validation
});
