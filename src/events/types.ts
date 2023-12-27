export const EVENT_KEY = process.env.EVENTS_TABLE as string;

export type Event = {
  eventId: string;
  name: string;
};
