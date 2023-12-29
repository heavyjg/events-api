import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import type {
  Event,
  IGetCommandOutput,
  IPutCommandOutput,
  IUpdateCommandOutput,
} from "../types";
import { EVENT_KEY } from "../types";
import { getDdbDocumentClient } from "../aws/aws";

const EventsDB = () => {
  const ddbDocumentClient = getDdbDocumentClient();

  const saveEventToAWS = async (event: Event) => {
    const params = {
      TableName: EVENT_KEY,
      Item: event,
    };

    return (await ddbDocumentClient.send(
      new PutCommand(params)
    )) as IPutCommandOutput<Event>;
  };

  const getEventFromAWS = async (
    eventId: string
  ): Promise<Event | undefined> => {
    const params = {
      TableName: EVENT_KEY,
      Key: {
        eventId: eventId,
      },
    };

    const { Item: event } = (await ddbDocumentClient.send(
      new GetCommand(params)
    )) as IGetCommandOutput<Event>;

    return event;
  };

  const updateEventInAWS = async (event: Event): Promise<Event | undefined> => {
    const params: UpdateCommandInput = {
      TableName: EVENT_KEY,
      Key: {
        eventId: event.eventId,
      },
      UpdateExpression:
        "set eventName = :n, eventType = :t, eventDate = :d, location = :l, host = :h, description = :desc, capacity = :c, ticketPrice = :p, tags = :tags, status = :s",
      ExpressionAttributeValues: {
        ":n": event.eventName,
        ":t": event.eventType,
        ":d": event.eventDate,
        ":l": event.location,
        ":h": event.host,
        ":desc": event.description,
        ":c": event.capacity,
        ":p": event.ticketPrice,
        ":tags": event.tags,
        ":s": event.status,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const { Attributes: events } = (await ddbDocumentClient.send(
      new UpdateCommand(params)
    )) as IUpdateCommandOutput<Event>;

    return events;
  };

  const save = async (event: Event) => {
    await saveEventToAWS(event);
  };

  const get = async (eventId: string): Promise<Event | undefined> => {
    return await getEventFromAWS(eventId);
  };

  return {
    save,
    get,
  };
};

export default EventsDB;
