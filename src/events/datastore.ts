import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import type { Event } from "./types";
import { EVENT_KEY } from "./types";
import { getDdbDocumentClient } from "../aws/aws";

const EventsDB = () => {
  const ddbDocumentClient = getDdbDocumentClient();

  const saveEventToAWS = async (event: Event) => {
    const params = {
      TableName: EVENT_KEY,
      Item: event,
    };

    try {
      return await ddbDocumentClient.send(new PutCommand(params));
    } catch (error) {
      return error;
    }
  };

  const getEventFromAWS = async (eventId: string) => {
    const params = {
      TableName: EVENT_KEY,
      Key: {
        eventId: eventId,
      },
    };

    try {
      const { Item } = await ddbDocumentClient.send(new GetCommand(params));
      if (Item) {
        return Item;
      } else {
        return undefined;
      }
    } catch (error) {
      return { error };
    }
  };

  const save = async (event: Event) => {
    await saveEventToAWS(event);
  };

  const get = async (eventId: string) => {
    return await getEventFromAWS(eventId);
  };

  return {
    save,
    get,
  };
};

export default EventsDB;
