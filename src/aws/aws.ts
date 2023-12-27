import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = process.env.IS_OFFLINE
  ? new DynamoDBClient({
      region: "localhost",
      endpoint: "http://0.0.0.0:8000",
      credentials: {
        accessKeyId: "MockAccessKeyId",
        secretAccessKey: "MockSecretAccessKey",
      },
    })
  : new DynamoDBClient({});

export const ddbDocumentClient = DynamoDBDocumentClient.from(client);
