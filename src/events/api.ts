import type {
  Context,
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import * as express from "express";
import * as serverless from "serverless-http";
import {
  saveEvent,
  getEvent,
  updateEvent,
  getAllEvents,
  deleteEvent,
} from "./eventsController";

const app = express();
app.use(express.json());

app.get("/events/:eventId", getEvent);

app.get("/events", getAllEvents);

app.post("/events", saveEvent);

app.put("/events/:eventId", updateEvent);

app.delete("/events/:eventId", deleteEvent);

export default app;

const lambdaHandler = serverless(app);

export const handler: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {
  return lambdaHandler(event, context);
};
