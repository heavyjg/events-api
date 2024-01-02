import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  UpdateCommandInput,
  ScanCommand,
  DeleteCommandInput,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import type {
  AttributeValue,
  Event,
  IGetCommandOutput,
  IPutCommandOutput,
  IUpdateCommandOutput,
} from "../types";
import { EVENT_KEY } from "../types";
import { getDdbDocumentClient } from "../aws/aws";
import { ReturnValue } from "@aws-sdk/client-dynamodb";

const EventsDB = () => {
  const ddbDocumentClient = getDdbDocumentClient();

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

  const getAllFromAWS = async (): Promise<Event[] | undefined> => {
    const params = {
      TableName: EVENT_KEY,
    };

    try {
      const response = await ddbDocumentClient.send(new ScanCommand(params));

      // Convert DynamoDB items to normal JavaScript objects
      const events = response?.Items?.map((item) => item as Event) ?? [];
      return events as Event[];
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving events");
    }
  };

  const saveEventToAWS = async (event: Event): Promise<Event | undefined> => {
    const params = {
      TableName: EVENT_KEY,
      Item: event,
    };

    (await ddbDocumentClient.send(
      new PutCommand(params)
    )) as IPutCommandOutput<Event>;

    return event;
  };

  const updateEventInAWS = async (
    eventId: string,
    updatedFields: Partial<Event>
  ) => {
    // Build the update expression and attribute values based on what's provided
    let updateExpression = "set";
    const expressionAttributeValues: { [key: string]: AttributeValue } = {};

    delete updatedFields.eventId;

    Object.entries(updatedFields).forEach(([key, value], index) => {
      // DynamoDB does not allow empty strings, so skip them
      if (value !== undefined && value !== "") {
        const attributeKey = `:${key}`;

        if (key == "location") {
          updateExpression += ` ${"#location"} = ${attributeKey}`;
        } else if (key == "capacity") {
          updateExpression += ` ${"#capacity"} = ${attributeKey}`;
        } else if (key == "status") {
          updateExpression += ` ${"#status"} = ${attributeKey}`;
        } else updateExpression += ` ${key} = ${attributeKey}`;

        expressionAttributeValues[attributeKey] = value;

        if (index < Object.entries(updatedFields).length - 1) {
          updateExpression += ",";
        }
      }
    });

    // If no valid fields to update, return or throw an error
    if (Object.keys(expressionAttributeValues).length === 0) {
      throw new Error("No valid fields to update");
    }

    const params: UpdateCommandInput = {
      TableName: EVENT_KEY,
      Key: { eventId },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: {
        "#location": "location",
        "#capacity": "capacity",
        "#status": "status",
      },
      ConditionExpression: "attribute_exists(eventId)",
      ReturnValues: "NONE" as ReturnValue,
    };

    try {
      (await ddbDocumentClient.send(
        new UpdateCommand(params)
      )) as IUpdateCommandOutput<Event>;
    } catch (error) {
      if ((error as Error).name === "ConditionalCheckFailedException") {
        throw new Error("Event not found");
      } else {
        console.error(error);
        throw new Error("Internal Server Error");
      }
    }
  };

  const deleteEventFromAWS = async (eventId: string): Promise<void> => {
    const params: DeleteCommandInput = {
      TableName: EVENT_KEY,
      Key: {
        eventId: eventId,
      },
      ConditionExpression: "attribute_exists(eventId)",
    };

    try {
      await ddbDocumentClient.send(new DeleteCommand(params));
      console.log(`Event with eventId: ${eventId} successfully deleted.`);
    } catch (error) {
      console.log({ error });
      if ((error as Error).name === "ConditionalCheckFailedException") {
        throw new Error("Event not found or already deleted");
      } else {
        console.error(error);
        throw new Error("Internal Server Error during event deletion");
      }
    }
  };

  const get = async (eventId: string): Promise<Event | undefined> => {
    return await getEventFromAWS(eventId);
  };

  const getAll = async (): Promise<Event[] | undefined> => {
    return await getAllFromAWS();
  };

  const save = async (event: Event): Promise<Event | undefined> => {
    return await saveEventToAWS(event);
  };

  const update = async (eventId: string, event: Event) => {
    await updateEventInAWS(eventId, event);
  };

  const del = async (eventId: string) => {
    await deleteEventFromAWS(eventId);
  };

  return {
    get,
    getAll,
    save,
    update,
    del,
  };
};

export default EventsDB;
