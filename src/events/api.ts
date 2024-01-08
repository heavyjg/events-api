import type {
  Context,
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import express from "express";
import serverless from "serverless-http";
import {
  saveEvent,
  getEvent,
  updateEvent,
  getAllEvents,
  deleteEvent,
} from "./eventsController";

// Create Express app
const app = express();

// Parse request body as JSON
app.use(express.json());

// Handle GET request for single event
app.get("/events/:eventId", getEvent);

// Handle GET request for all events
app.get("/events", getAllEvents);

// Handle POST request to create new event
app.post("/events", saveEvent);

// Handle PUT request to update existing event
app.put("/events/:eventId", updateEvent);

// Handle DELETE request to delete event
app.delete("/events/:eventId", deleteEvent);

export default app;

//Put serverless on top of express
const lambdaHandler = serverless(app);

export const handler: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {
  return lambdaHandler(event, context);
};
