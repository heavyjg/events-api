import {
  DeleteCommandOutput,
  GetCommandOutput,
  PutCommandOutput,
  QueryCommandOutput,
  ScanCommandOutput,
  UpdateCommandOutput,
} from "@aws-sdk/lib-dynamodb";

export const EVENT_KEY = process.env.EVENTS_TABLE as string;

export type Event = {
  eventId: string; // Unique identifier for the event
  eventName: string; // Name of the event
  eventType: string; // Type of the event (concert, party, show, dinner, etc.)
  eventDate: string; // Date and time of the event (ISO 8601 format recommended)
  location: string; // Location of the event
  host: string; // Host of the event
  description?: string; // Optional brief description of the event
  capacity?: number; // Optional maximum number of attendees
  ticketPrice?: number; // Optional ticket price for the event
  tags?: string[]; // Optional list of tags or keywords associated with the event
  status?: string; // Optional current status of the event (scheduled, cancelled, etc.)
};

export type IScanCommandOutput<T> = Omit<ScanCommandOutput, "Items"> & {
  Items?: T;
};

export type IGetCommandOutput<T> = Omit<GetCommandOutput, "Item"> & {
  Item?: T;
};

export type IQueryCommandOutput<T> = Omit<QueryCommandOutput, "Items"> & {
  Items?: T;
};

export type IPutCommandOutput<T> = Omit<PutCommandOutput, "Attributes"> & {
  Attributes?: T;
};

export type IDeleteCommandOutput<T> = Omit<
  DeleteCommandOutput,
  "Attributes"
> & {
  Attributes?: T;
};

export type IUpdateCommandOutput<T> = Omit<
  UpdateCommandOutput,
  "Attributes"
> & {
  Attributes?: T;
};
