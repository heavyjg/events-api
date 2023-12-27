import { Request, Response } from "express";
import EventsDB from "../datastore/ddbEvents";
import type { Event } from "./types";
import { v4 as uuidv4 } from "uuid";
const { save, get } = EventsDB();

export async function getEvent(request: Request, response: Response) {
  const eventId = request.params.eventId;
  if (eventId == null) {
    response.statusCode = 400;
    response.send("Error: missing eventId");
    return;
  }

  const event = await get(eventId);
  console.log({ event });
  response.statusCode = 200;
  response.json(event);
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
