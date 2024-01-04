<div align="center">
<h1>
<a name="logo" href="https://www.aregtech.com"><img align="center" src="resources/Events_API.png" alt="AREG SDK Home" style="width:50%;height:30%"/></a>
<br /><br /><strong>Events API</strong>

</h1>

[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) [![dependency - TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=TypeScript&logoColor=white)](https://www.npmjs.com/package/TypeScript)  
[![Build status](https://github.com/heavyjg/events-api/actions/workflows/deploy.yml/badge.svg)](https://github.com/heavyjg/events-api/actions?query=main) ![Known Vulnerabilities](https://snyk.io/test/github/heavyjg/events-api/badge.svg)  
[![Maintainability](https://api.codeclimate.com/v1/badges/c3923e6b729e5159e3d3/maintainability)](https://codeclimate.com/github/heavyjg/events-api/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/c3923e6b729e5159e3d3/test_coverage)](https://codeclimate.com/github/heavyjg/events-api/test_coverage)

---

</div>

## Introduction[![](https://raw.githubusercontent.com/aregtech/areg-sdk/master/docs/img/pin.svg)](#introduction)

**events-api** is a practical and effective tool for managing events, built using modern technologies including Node.js 18.x, TypeScript, Serverless Framework, and DynamoDB. This combination of technologies ensures a scalable, efficient, and easy-to-maintain API.

Key Features:

- **Built with Node.js 18 and TypeScript**: Offers a stable and scalable backend with the added benefits of TypeScript's strong typing.
- **Serverless Framework Integration**: Ensures easy deployment and lower maintenance overhead, making the API cost-effective and scalable.
- **DynamoDB for Data Storage**: Leverages AWS DynamoDB for reliable and fast data storage, ideal for handling event data.
- **Event CRUD Operations**: Supports creating, reading, updating, and deleting events with ease.
- **Simple Event Tracking**: Manage essential details like event names, types, dates, and locations.
- **Data Validation**: Includes basic validation to ensure the accuracy and integrity of event data.
- **Ease of Use**: Designed to be straightforward and user-friendly, making it accessible for developers of varying skill levels.

This API is a perfect solution for developers looking for a simple yet efficient way to handle event management in their applications, with the backing of robust and modern technologies.

---

## Installation[![](https://raw.githubusercontent.com/aregtech/areg-sdk/master/docs/img/pin.svg)](#installation)

#### Requirements

- [AWS Credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) ready to go
- Node.js 18.x
- [Java Runtime Engine (JRE) version 6.x or newer OR docker CLI client](https://www.serverless.com/plugins/serverless-dynamodb-local)

#### Steps

1. Install dependencies with:

```
npm i
npm i -g serverless
serverless dynamodb install
```

2. Then initialize husky hooks with:

```
npm prepare
```

3. Run to connect with Serverless dashboard account:

```
serverless
```

---

## Deploy[![](https://raw.githubusercontent.com/aregtech/areg-sdk/master/docs/img/pin.svg)](#deploy)

Now you can deploy locally with:

```
serverless offline start
```

or to any stage with:

```
serverless deploy -stage your-stage
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-express-dynamodb-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-express-dynamodb-api-project-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-dynamodb-api-project-dev-api (766 kB)
```

---

#### Thank you!!

**Our amazing contributors**:

[<img src="https://github.com/heavyjg.png" width="60px;"/><br /><sub><a href="https://github.com/heavyjg">João G.</a></sub>](https://github.com/heavyjg/events-api)
