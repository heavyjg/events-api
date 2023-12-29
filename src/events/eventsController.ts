import { Request, Response } from "express";
import EventsDB from "./datastore";
import type { Event } from "../types";
import { v4 as uuidv4 } from "uuid";
const { save, get } = EventsDB();

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

  if (reqBody == null) {
    response.statusCode = 400;
    response.send("Error: a note create request must have a body");
    return;
  }

  const event = reqBody as Event;

  event.eventId = uuidv4();

  await save(event);
  response.statusCode = 201;
  response.send(event);
}
