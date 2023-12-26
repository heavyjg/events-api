import type {
  Context,
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import type { Event } from "./types";
import express from "express";
import serverless from "serverless-http";

const app = express();
app.use(express.json());

const mockEvents: Event[] = [
  { eventId: "", name: "" },
  { eventId: "1", name: "Event One" },
  { eventId: "2", name: "Event Two" },
  // Add more mock events as needed
];

app.get("/events/:eventId", async function (req, res) {
  const eventId: number = req.params.eventId as unknown as number;
  const event: Event = mockEvents[eventId];

  if (event) {
    res.json(event);
  } else {
    res
      .status(404)
      .json({ error: 'Could not find event with provided "eventId"' });
  }
});

export default app;

const lambdaHandler = serverless(app);

export const handler: Handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyStructuredResultV2> => {
  return lambdaHandler(event, context);
};
