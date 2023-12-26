# Events API - Serverless Guru Challenge

This project is the artifact of a code challenge.
The goal is to build a API to store and manipulates events, using: Serverless Framework, Node, Lambda, DynamoDB, and Github Actions.

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) [![npm version](https://badge.fury.io/js/serverless.svg)](https://badge.fury.io/js/serverless) [![Build status](https://github.com/heavyjg/events-api/actions/workflows/main.yml/badge.svg)](https://github.com/heavyjg/sguru-challenge-events-api/actions?query=main) ![Known Vulnerabilities](https://snyk.io/test/github/heavyjg/events-api/badge.svg)

## Usage

### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-express-dynamodb-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-express-dynamodb-api-project-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-dynamodb-api-project-dev-api (766 kB)
```
