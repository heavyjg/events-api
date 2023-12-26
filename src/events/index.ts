import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import express from "express";
import serverless from "serverless-http";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello, Lambda 1!");
});

app.get("/custom-var", (_req, res) => {
  res.send(process.env.CUSTOM_VAR || "No custom variable set");
});

const lambdaHandler = serverless(app);

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: any
): Promise<APIGatewayProxyStructuredResultV2> => {
  return lambdaHandler(event, context);
};
