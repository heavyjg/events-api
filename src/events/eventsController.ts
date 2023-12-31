import { Request, Response } from "express";
import EventsDB from "./datastore";
import type { Event } from "../types";
import { v4 as uuidv4 } from "uuid";
import { validateFieldTypes, validateKeys, validKeys } from "./validations";
const { get, getAll, save, update, delete_ } = EventsDB();

function handleGetEventResponse(
  response: Response,
  result: Event | Event[] | undefined,
) {
  if (!result) {
    response.status(404).json({ error: "Event not found" });
  } else if ("error" in result) {
    response.status(500).json({
      error: "Internal Server Error",
    });
  } else {
    response.status(200).json(result);
  }
}

export async function getEvent(request: Request, response: Response) {
  const eventId = request.params.eventId;
  if (eventId == null) {
    response.status(400).send({ error: "missing eventId" });
    return;
  }

  try {
    const result: Event | undefined = await get(eventId);

    handleGetEventResponse(response, result);
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: "Internal Server Error" });
  }
}

export async function saveEvent(request: Request, response: Response) {
  const reqBody = request.body;

  // Basic validation for request body existence
  if (!reqBody || typeof reqBody !== "object") {
    response.status(400).send({ error: "Invalid request body" });
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
      .send({ error: `Missing required fields: ${missingFields.join(", ")}` });
    return;
  }

  const errorMessage = validateKeys(reqBody, validKeys);
  if (errorMessage) {
    response.status(400).send({ error: errorMessage });
    return;
  }

  // Type validation
  const typeErrorMessage = validateFieldTypes(reqBody);
  if (typeErrorMessage) {
    response.status(400).send({ error: typeErrorMessage });
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
    response.status(500).send({ error: "Internal Server Error" });
  }
}

export async function updateEvent(request: Request, response: Response) {
  const eventId = request.params.eventId;

  if (eventId == null) {
    response.status(400).send({ error: "missing eventId" });
    return;
  }

  const reqBody = request.body;

  // Basic validation for request body existence
  if (
    !reqBody ||
    typeof reqBody !== "object" ||
    Object.keys(reqBody).length === 0
  ) {
    response.status(400).send({ error: "Invalid request body" });
    return;
  }

  const errorMessage = validateKeys(reqBody, validKeys);
  if (errorMessage) {
    response.status(400).send(errorMessage);
    return;
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
      response.status(404).send({ error: "Event not found" });
    } else
      response
        .status(500)
        .send({ error: "Internal Server Error, " + (error as Error)?.message });
  }
}

export async function getAllEvents(request: Request, response: Response) {
  try {
    const result: Event[] | undefined = await getAll();

    handleGetEventResponse(response, result);
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: "Internal Server Error" });
  }
}

export async function deleteEvent(request: Request, response: Response) {
  const eventId = request.params.eventId;

  if (!eventId) {
    response.status(400).send({ error: "missing eventId" });
    return;
  }

  try {
    await delete_(eventId);
    response.status(204).send();
  } catch (error) {
    const errorMessage = (error as Error).message;

    if (errorMessage === "Event not found or already deleted") {
      response.status(404).send({ error: "Event not found" });
    } else {
      console.error(error);
      response
        .status(500)
        .send({ error: "Internal Server Error, " + errorMessage });
    }
  }
}
