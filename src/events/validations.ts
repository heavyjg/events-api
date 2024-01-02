// Define the valid keys based on the Event type
export const validKeys = [
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
// Utility function to validate object keys
export function validateKeys(obj: any, validKeys: string[]): string | null {
  for (const key of Object.keys(obj)) {
    if (!validKeys.includes(key)) {
      return `Error: Invalid field '${key}' in request body`;
    }
  }
  return null; // No error found
}
// Function to validate the data types of the fields
export function validateFieldTypes(reqBody: any): string | null {
  if (typeof reqBody.eventName !== 'string') return 'eventName must be a string';
  if (typeof reqBody.eventType !== 'string') return 'eventType must be a string';
  if (typeof reqBody.eventDate !== 'string') return 'eventDate must be a string'; // assuming ISO 8601 format string
  if (typeof reqBody.location !== 'string') return 'location must be a string';
  if (typeof reqBody.host !== 'string') return 'host must be a string';
  if (reqBody.description && typeof reqBody.description !== 'string') return 'description must be a string';
  if (reqBody.capacity && typeof reqBody.capacity !== 'number') return 'capacity must be a number';
  if (reqBody.ticketPrice && typeof reqBody.ticketPrice !== 'number') return 'ticketPrice must be a number';
  if (reqBody.tags && !Array.isArray(reqBody.tags)) return 'tags must be an array of strings';
  if (reqBody.status && typeof reqBody.status !== 'string') return 'status must be a string';

  return null; // No error found
}
