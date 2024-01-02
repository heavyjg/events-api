import { Request, Response } from "express";
import EventsDB from "./datastore";
import type { Event } from "../types";
import { v4 as uuidv4 } from "uuid";
const { save, get, update, getAll } = EventsDB();

// Define the valid keys based on the Event type
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

// Function to check if a key is a valid key of Event
function isValidKey(key: string): key is keyof Event {
  return validKeys.includes(key);
}

export async function getEvent(request: Request, response: Response) {
  const eventId = request.params.eventId;
  if (eventId == null) {
    response.status(400).send("Error: missing eventId");
    return;
  }

  try {
    const result: Event | undefined = await get(eventId);

    if (!result) {
      response.status(404).json({ error: "Event not found" });
    } else if ("error" in result) {
      response.status(500).json({
        error: "An error occurred while retrieving the event",
      });
    } else {
      response.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
}

export async function saveEvent(request: Request, response: Response) {
  const reqBody = request.body;

  // Basic validation for request body existence
  if (!reqBody || typeof reqBody !== "object") {
    response.status(400).send("Error: Invalid request body");
    return;
  }

  // Validating mandatory fields
  const requiredFields = [
    "eventName",
    "eventType",
    "eventDate",
    "location",
    "host",
  ];
  const missingFields = requiredFields.filter((field) => !reqBody[field]);

  if (missingFields.length > 0) {
    response
      .status(400)
      .send(`Error: Missing required fields: ${missingFields.join(", ")}`);
    return;
  }

  // Constructing an event object with validation
  const event: Event = {
    eventId: uuidv4(), // Generate a new UUID for the event
    eventName: reqBody.eventName,
    eventType: reqBody.eventType,
    eventDate: reqBody.eventDate,
    location: reqBody.location,
    host: reqBody.host,
    description: reqBody.description,
    capacity: reqBody.capacity,
    ticketPrice: reqBody.ticketPrice,
    tags: reqBody.tags,
    status: reqBody.status || "scheduled",
  };

  try {
    const result = await save(event);
    response.status(201).json(result);
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
}

export async function updateEvent(request: Request, response: Response) {
  const eventId = request.params.eventId;

  if (eventId == null) {
    response.status(400).send("Error: missing eventId");
    return;
  }

  const reqBody = request.body;

  // Basic validation for request body existence
  if (
    !reqBody ||
    typeof reqBody !== "object" ||
    Object.keys(reqBody).length === 0
  ) {
    response.status(400).send("Error: Invalid request body");
    return;
  }

  // Check if all keys in the request body are part of the Event type
  for (const key of Object.keys(reqBody)) {
    if (!isValidKey(key)) {
      response
        .status(400)
        .send(`Error: Invalid field '${key}' in request body`);
      return;
    }
  }

  // Constructing an event object with validation
  const event: Event = {
    eventId: eventId,
    eventName: reqBody.eventName,
    eventType: reqBody.eventType,
    eventDate: reqBody.eventDate,
    location: reqBody.location,
    host: reqBody.host,
    description: reqBody.description,
    capacity: reqBody.capacity,
    ticketPrice: reqBody.ticketPrice,
    tags: reqBody.tags,
    status: reqBody.status,
  };

  try {
    await update(eventId, event);
    response.status(204).send();
  } catch (error) {
    if ((error as Error).message === "Event not found") {
      response.status(404).send("Event not found");
    } else
      response
        .status(500)
        .send("Internal Server Error, " + (error as Error)?.message);
  }
}

export async function getAllEvents(request: Request, response: Response) {
  try {
    const result: Event[] | undefined = await getAll();

    if (!result) {
      response.status(404).json({ error: "Event not found" });
    } else if ("error" in result) {
      response.status(500).json({
        error: "An error occurred while retrieving the event",
      });
    } else {
      response.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
}
