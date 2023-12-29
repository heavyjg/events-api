import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import type { Event, IGetCommandOutput } from "../types";
import { EVENT_KEY } from "../types";
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

  const getEventFromAWS = async (
    eventId: string,
  ): Promise<Event | undefined> => {
    const params = {
      TableName: EVENT_KEY,
      Key: {
        eventId: eventId,
      },
    };

    const { Item: event } = (await ddbDocumentClient.send(
      new GetCommand(params),
    )) as IGetCommandOutput<Event>;

    return event;
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
